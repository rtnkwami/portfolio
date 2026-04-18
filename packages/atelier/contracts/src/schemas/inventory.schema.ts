import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
  category: z.string().nonempty(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().nonnegative(),
  images: z.array(z.url()).optional()
})