import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const categoryParamsSchema = z.object({
  id: z.uuid(),
});

export class CategoryParams extends createZodDto(categoryParamsSchema) {}
