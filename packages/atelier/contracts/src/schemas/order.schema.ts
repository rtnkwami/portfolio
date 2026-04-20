import { z } from 'zod';
import { OrderStatus } from '../types/order.types.js';

export const OrderStatusUpdateSchema = z.object({
  status: z.enum(OrderStatus)
});

export const OrderSearchSchema = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
  status: z.enum(OrderStatus).optional(),
  page: z.number().positive().default(1),
  limit: z.number().positive().default(20),
})
  .strict();