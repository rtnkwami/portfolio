import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const categoryParamsSchema = z.object({
  id: z.uuid(),
});

const createCategorySchema = z.object({
  name: z.string(),
});

//  --- EXPORTS ---
export class CategoryParams extends createZodDto(categoryParamsSchema) {}

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}
