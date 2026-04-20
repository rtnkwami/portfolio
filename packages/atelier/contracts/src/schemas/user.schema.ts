import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.email(),
  avatar: z.url({ protocol: /^http(s)?$/ }).optional()
});

export const UpdateProfileSchema = CreateUserSchema.partial();