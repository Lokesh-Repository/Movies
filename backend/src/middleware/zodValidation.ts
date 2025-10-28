import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateBody = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
              value: err.code === 'invalid_type' ? undefined : err.received,
            })),
          },
        });
      }
      next(error);
    }
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedParams = schema.parse(req.params);
      req.params = validatedParams as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid parameters',
            code: 'PARAMETER_VALIDATION_ERROR',
            details: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
              value: err.code === 'invalid_type' ? undefined : err.received,
            })),
          },
        });
      }
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedQuery = schema.parse(req.query);
      req.query = validatedQuery as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid query parameters',
            code: 'QUERY_VALIDATION_ERROR',
            details: error.issues.map((err: any) => ({
              field: err.path.join('.'),
              message: err.message,
              value: err.code === 'invalid_type' ? undefined : err.received,
            })),
          },
        });
      }
      next(error);
    }
  };
};