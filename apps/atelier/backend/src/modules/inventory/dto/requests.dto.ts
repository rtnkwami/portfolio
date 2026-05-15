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
    price: z.coerce.number().positive(),
    stock: z.coerce.number().positive(),
  }),
  category_id: z.uuid(),
});

const updateProductSchema = createProductSchema.partial();

const searchProductSchema = z.object({
  name: z.string().optional(),
  minPrice: z.coerce.number().min(1).optional(),
  maxPrice: z.coerce.number().min(1).optional(),
  category: z.uuid().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

//  --- EXPORTS ---
export class ParamsDto extends createZodDto(paramsSchema) {}

export class CategoryParams extends createZodDto(paramsSchema) {}

export class CreateCategoryDto extends createZodDto(createCategorySchema) {}

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}

export class CreateProductDto extends createZodDto(createProductSchema) {}

export class UpdateProductDto extends createZodDto(updateProductSchema) {}

export class ProductSearchParams extends createZodDto(searchProductSchema) {}
