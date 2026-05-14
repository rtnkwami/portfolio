import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const categoryResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
});

const getAllCategoriesResponseSchema = z.object({
  categories: z.array(z.object({ id: z.uuid(), name: z.string() })),
});

const privateProductSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().nonempty(),
  stock: z.number().positive(),
});

// --- EXPORTS ---
export class CategoryResponse extends createZodDto(categoryResponseSchema) {}

export class getAllCategoriesResponse extends createZodDto(
  getAllCategoriesResponseSchema,
) {}

export class PrivateProduct extends createZodDto(privateProductSchema) {}
