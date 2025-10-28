import { Router, Request, Response, NextFunction } from 'express';
import { EntryService } from '../services/entryService';
import { 
  EntryCreateSchema, 
  EntryUpdateSchema, 
  EntryIdSchema, 
  PaginationSchema 
} from '../schemas/entry';
import { ApiError } from '../middleware/errorHandler';

const router = Router();

/**
 * GET /api/entries
 * Fetch entries with cursor-based pagination for infinite scroll
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = PaginationSchema.safeParse(req.query);
    
    if (!validationResult.success) {
      const error = new Error('Invalid query parameters') as ApiError;
      error.statusCode = 400;
      error.code = 'INVALID_QUERY_PARAMS';
      return next(error);
    }

    const { cursor, limit } = validationResult.data;

    const result = await EntryService.getEntries(cursor, limit);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/entries
 * Create a new entry with validation
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = EntryCreateSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const error = new Error('Invalid entry data') as ApiError;
      error.statusCode = 400;
      error.code = 'INVALID_ENTRY_DATA';
      return next(error);
    }

    const entryData = validationResult.data;

    const newEntry = await EntryService.createEntry(entryData);

    res.status(201).json({
      success: true,
      data: newEntry,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/entries/:id
 * Update an existing entry with validation
 */
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idValidation = EntryIdSchema.safeParse({ id: req.params.id });
    
    if (!idValidation.success) {
      const error = new Error('Invalid entry ID') as ApiError;
      error.statusCode = 400;
      error.code = 'INVALID_ENTRY_ID';
      return next(error);
    }

    const bodyValidation = EntryUpdateSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const error = new Error('Invalid update data') as ApiError;
      error.statusCode = 400;
      error.code = 'INVALID_UPDATE_DATA';
      return next(error);
    }

    const { id } = idValidation.data;
    const updateData = bodyValidation.data;

    const updatedEntry = await EntryService.updateEntry(id, updateData);

    res.json({
      success: true,
      data: updatedEntry,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/entries/:id
 * Delete an entry after validating existence
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idValidation = EntryIdSchema.safeParse({ id: req.params.id });
    
    if (!idValidation.success) {
      const error = new Error('Invalid entry ID') as ApiError;
      error.statusCode = 400;
      error.code = 'INVALID_ENTRY_ID';
      return next(error);
    }

    const { id } = idValidation.data;

    await EntryService.deleteEntry(id);

    res.json({
      success: true,
      data: { message: 'Entry deleted successfully' },
    });
  } catch (error) {
    next(error);
  }
});

export default router;