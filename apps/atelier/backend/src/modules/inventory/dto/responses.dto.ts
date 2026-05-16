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
  price: z.number().min(1),
  category: z.string().nonempty(),
  stock: z.int().min(0),
  images: z.array(z.url().nonempty()).default([]),
});

const publicProductSchema = privateProductSchema.omit({ stock: true });

const searchProductResponseSchema = z.object({
  products: z.array(publicProductSchema).default([]),
  page: z.int().min(1),
  perPage: z.int().min(1),
  total: z.int().min(0),
  totalPages: z.int().min(1),
});

const deleteSchema = z.object({
  deleted: z.uuid(),
});

const imageUploadSchema = z.object({
  uploadTo: z.url(),
  imageId: z.uuid(),
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

export class DeleteResponse extends createZodDto(deleteSchema) {}

export class ImageUploadResponse extends createZodDto(imageUploadSchema) {}
