import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
  category: z.string().nonempty(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().nonnegative(),
  images: z.array(z.url()).optional()
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const SearchProductSchema = z.object({
  name: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().max(100).optional(),
});

const ReservationItemSchema = z.object({
  id: z.uuid(),
  quantity: z.number().int().positive(),
});
export const ReserveStockSchema = z.object({
  orderId: z.uuid(),
  items: z.array(ReservationItemSchema).nonempty(),
});

export const CommitStockRequestSchema = z.object({
  reservationId: z.uuid(),
});
