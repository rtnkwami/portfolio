import { z } from 'zod';
import type { CartItemSchema, CartSchema } from '../schemas/cart.schema.js';

export type Cart = z.infer<typeof CartSchema>;

export type CartItem = z.infer<typeof CartItemSchema>;