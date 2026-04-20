import { z } from 'zod';
import type { CreateUserSchema, UpdateProfileSchema } from '../schemas/user.schema.js';

export type CreateUserParams = z.infer<typeof CreateUserSchema>;

export type UpdateProfileParams = z.infer<typeof UpdateProfileSchema>;
