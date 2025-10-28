import type { IncomingMessage, ServerResponse } from "http";

// Define Vercel types inline to avoid import issues
interface VercelRequest extends IncomingMessage {
  query: { [key: string]: string | string[] };
  body: any;
}

interface VercelResponse extends ServerResponse {
  json: (object: any) => VercelResponse;
  status: (statusCode: number) => VercelResponse;
}
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { errorHandler, notFoundHandler } from "../src/middleware/errorHandler";
import { apiLimiter } from "../src/middleware/rateLimiter";
import entriesRouter from "../src/routes/entries";

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://movies-frontend-ochre.vercel.app",
      /\.vercel\.app$/
    ],
    credentials: true,
  })
);

// Rate limiting
app.use("/api", apiLimiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Basic route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    data: { message: "Movies & TV Shows Manager API is running!" },
  });
});

// API routes
app.use("/api/entries", entriesRouter);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
