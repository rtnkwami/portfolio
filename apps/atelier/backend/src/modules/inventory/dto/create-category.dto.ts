import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const createCategorySchema = z.object({
  name: z.string(),
});

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
