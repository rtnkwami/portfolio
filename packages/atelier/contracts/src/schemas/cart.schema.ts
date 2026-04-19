import { z } from 'zod';

export const CartItemSchema = z.object({
  id: z.uuid(),
  name: z.string().nonempty(),
  price: z.number().positive(),
  quantity: z.number().positive(),
  image: z.url()
});

export const CartSchema = z.object({
  items: z.array(CartItemSchema).default([])
});