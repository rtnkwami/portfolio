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
  id: z.uuid(),
  name: z.string().nonempty(),
  description: z.string().optional(),
  price: z.number().positive(),
  category: z.string().nonempty(),
  stock: z.int().positive(),
  images: z.array(z.string().nonempty()).default([]),
});

const publicProductSchema = privateProductSchema.omit({ stock: true });

const searchProductResponseSchema = z.object({
  products: z.array(publicProductSchema).default([]),
  page: z.int().min(1).positive(),
  perPage: z.int().min(1).positive(),
  total: z.int().nonnegative(),
  totalPages: z.int().positive(),
});

// --- EXPORTS ---
export class CategoryResponse extends createZodDto(categoryResponseSchema) {}

export class getAllCategoriesResponse extends createZodDto(
  getAllCategoriesResponseSchema,
) {}

export class PrivateProduct extends createZodDto(privateProductSchema) {}

export class PublicProduct extends createZodDto(publicProductSchema) {}

export class ProductSearchResults extends createZodDto(
  searchProductResponseSchema,
) {}
