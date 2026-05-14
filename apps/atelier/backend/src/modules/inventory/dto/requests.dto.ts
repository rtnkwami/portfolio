import { createZodDto } from 'nestjs-zod';
import z from 'zod';

const paramsSchema = z.object({
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

const updateProductSchema = createProductSchema.partial();

//  --- EXPORTS ---
export class ParamsDto extends createZodDto(paramsSchema) {}

export class CategoryParams extends createZodDto(paramsSchema) {}

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}

export class CreateProductDto extends createZodDto(createProductSchema) {}

export class UpdateProductDto extends createZodDto(updateProductSchema) {}
