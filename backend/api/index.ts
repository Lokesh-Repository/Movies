import type { IncomingMessage, ServerResponse } from "http";
import dotenv from "dotenv";

// Define Vercel types inline to avoid import issues
interface VercelRequest extends IncomingMessage {
  query: { [key: string]: string | string[] };
  body: any;
  method?: string;
  url?: string;
}

interface VercelResponse extends ServerResponse {
  json: (object: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
}

// Load environment variables
dotenv.config();

// CORS headers function
function setCorsHeaders(res: VercelResponse, origin?: string) {
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://movies-frontend-ochre.vercel.app",
    "http://localhost:5173"
  ];
  
  const isAllowed = origin && (
    allowedOrigins.includes(origin) || 
    origin.endsWith('.vercel.app')
  );
  
  const allowedOrigin = isAllowed ? origin : allowedOrigins[0];
  
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Initialize Prisma lazily
let prisma: any = null;

async function getPrismaClient() {
  if (!prisma) {
    try {
      // Try to import from the generated location first
      let PrismaClient;
      try {
        const generated = await import('../src/generated/prisma');
        PrismaClient = generated.PrismaClient;
      } catch {
        // Fallback to standard import
        const standard = await import('@prisma/client');
        PrismaClient = standard.PrismaClient;
      }
      
      prisma = new PrismaClient();
      console.log('Prisma client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Prisma:', error);
      throw error;
    }
  }
  return prisma;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const origin = req.headers.origin as string;
  
  // Set CORS headers
  setCorsHeaders(res, origin);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Health check
  if (req.url === '/api/health' || req.url === '/health') {
    return res.status(200).json({
      success: true,
      data: { message: 'Movies & TV Shows Manager API is running!' }
    });
  }
  
  // Handle entries routes
  if (req.url?.startsWith('/api/entries') || req.url?.startsWith('/entries')) {
    try {
      const prismaClient = await getPrismaClient();
      
      if (req.method === 'GET') {
        // Parse query parameters
        const url = new URL(req.url, `http://${req.headers.host}`);
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const page = parseInt(url.searchParams.get('page') || '1');
        const skip = (page - 1) * limit;
        
        // Get entries from database
        const entries = await prismaClient.entry.findMany({
          take: limit,
          skip: skip,
          orderBy: { createdAt: 'desc' }
        });
        
        const total = await prismaClient.entry.count();
        const totalPages = Math.ceil(total / limit);
        
        return res.status(200).json({
          success: true,
          data: {
            entries,
            pagination: {
              page,
              limit,
              total,
              totalPages,
              hasMore: page < totalPages
            }
          }
        });
      }
      
      return res.status(405).json({
        success: false,
        error: { message: 'Method not allowed' }
      });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Internal server error' }
      });
    }
  }
  
  // Default 404
  return res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
}