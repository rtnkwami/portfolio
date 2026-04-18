import { z } from 'zod';
import {
  CommitStockRequestSchema,
  CreateProductSchema,
  ReserveStockSchema,
  SearchProductSchema,
  UpdateProductSchema
} from '../schemas/inventory.schema.js';

export type CreateProductParams = z.infer<typeof CreateProductSchema>;

export type UpdateProductParams = z.infer<typeof UpdateProductSchema>;

export type SearchProductParams = z.infer<typeof SearchProductSchema>;

export type ReserveStockParams = z.infer<typeof ReserveStockSchema>;

export type CommitStockParams = z.infer<typeof CommitStockRequestSchema>;
