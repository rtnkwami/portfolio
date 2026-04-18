import { z } from 'zod';
import { CreateProductSchema } from '../schemas/inventory.schema.js';

export type CreateProductParams = z.infer<typeof CreateProductSchema>