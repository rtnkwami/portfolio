import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const categoryResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

const getAllCategoriesResponseSchema = z.object({
  categories: z.array(z.object({ id: z.uuid(), name: z.string() })),
});

// --- EXPORTS ---
export class CategoryResponse extends createZodDto(categoryResponseSchema) {}

export class getAllCategoriesResponse extends createZodDto(
  getAllCategoriesResponseSchema,
) {}
