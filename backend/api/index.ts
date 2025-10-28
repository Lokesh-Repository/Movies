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
function setCorsHeaders(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

// Initialize Prisma lazily
let prisma: any = null;

async function getPrismaClient() {
  if (!prisma) {
    try {
      // Try to import from the generated location first
      let PrismaClient;
      try {
        const generated = await import("../src/generated/prisma");
        PrismaClient = generated.PrismaClient;
      } catch {
        // Fallback to standard import
        const standard = await import("@prisma/client");
        PrismaClient = standard.PrismaClient;
      }

      prisma = new PrismaClient();
      console.log("Prisma client initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Prisma:", error);
      throw error;
    }
  }
  return prisma;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Parse request body for POST/PUT requests
  if (req.method === "POST" || req.method === "PUT") {
    if (
      !req.body &&
      req.headers["content-type"]?.includes("application/json")
    ) {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      await new Promise((resolve) => {
        req.on("end", () => {
          try {
            req.body = JSON.parse(body);
          } catch {
            req.body = {};
          }
          resolve(undefined);
        });
      });
    }
  }

  // Health check
  if (req.url === "/api/health" || req.url === "/health") {
    return res.status(200).json({
      success: true,
      data: { message: "Movies & TV Shows Manager API is running!" },
    });
  }

  // Handle entries routes
  if (req.url?.startsWith("/api/entries") || req.url?.startsWith("/entries")) {
    try {
      const prismaClient = await getPrismaClient();

      if (req.method === "GET") {
        // Parse query parameters
        const url = new URL(req.url, `http://${req.headers.host}`);
        const limit = parseInt(url.searchParams.get("limit") || "20");
        const cursor = url.searchParams.get("cursor");

        // Get entries from the real database
        const whereClause = cursor ? { id: { gt: cursor } } : {};
        
        const entries = await prismaClient.entry.findMany({
          where: whereClause,
          take: limit + 1, // Take one extra to check if there are more
          orderBy: { createdAt: 'desc' }
        });

        const hasMore = entries.length > limit;
        const data = hasMore ? entries.slice(0, limit) : entries;
        const nextCursor = hasMore ? data[data.length - 1].id : undefined;

        return res.status(200).json({
          success: true,
          data: {
            data: data,
            hasMore: hasMore,
            nextCursor: nextCursor,
          },
        });
      }

      if (req.method === "POST") {
        // Create new entry in database
        const { title, type, director, budget, location, duration, year } = req.body;
        
        const newEntry = await prismaClient.entry.create({
          data: {
            title,
            type,
            director,
            budget,
            location,
            duration,
            year
          }
        });
        
        return res.status(201).json({
          success: true,
          data: newEntry,
        });
      }

      // Handle individual entry operations (PUT, DELETE)
      const entryIdMatch = req.url.match(/\/api\/entries\/([^\/]+)/);
      if (entryIdMatch) {
        const entryId = entryIdMatch[1];

        if (req.method === "PUT") {
          // Update entry in database
          const { title, type, director, budget, location, duration, year } = req.body;
          
          const updatedEntry = await prismaClient.entry.update({
            where: { id: entryId },
            data: {
              title,
              type,
              director,
              budget,
              location,
              duration,
              year
            }
          });

          return res.status(200).json({
            success: true,
            data: updatedEntry,
          });
        }

        if (req.method === "DELETE") {
          // Delete entry from database
          await prismaClient.entry.delete({
            where: { id: entryId }
          });
          
          return res.status(200).json({
            success: true,
            data: { message: "Entry deleted successfully" },
          });
        }
      }

      return res.status(405).json({
        success: false,
        error: { message: "Method not allowed" },
      });
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({
        success: false,
        error: { message: "Internal server error" },
      });
    }
  }

  // Default 404
  return res.status(404).json({
    success: false,
    error: { message: "Route not found" },
  });
}
