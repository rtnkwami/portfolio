import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const categoryParamsSchema = z.object({
  id: z.uuid(),
});

const createCategorySchema = z.object({
  name: z.string(),
});

const updateCategorySchema = z.object({
  name: z.string(),
});

const createProductSchema = z.object({
  product: z.object({
    name: z.string().nonempty(),
    description: z.string().optional(),
    price: z.number().positive(),
    stock: z.number().positive(),
  }),
  category_id: z.uuid(),
});

//  --- EXPORTS ---
export class CategoryParams extends createZodDto(categoryParamsSchema) {}

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}

export class CreateProductParams extends createZodDto(createProductSchema) {}
