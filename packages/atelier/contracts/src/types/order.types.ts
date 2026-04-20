import type z from "zod";
import type { OrderSearchSchema, OrderStatusUpdateSchema } from "../schemas/order.schema.js";

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export type OrderStatusUpdateParams = z.infer<typeof OrderStatusUpdateSchema>;

export type OrderSearchParams = z.infer<typeof OrderSearchSchema>;