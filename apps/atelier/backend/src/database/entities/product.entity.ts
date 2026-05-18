import { defineEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Category } from './category.entity';
import { Image } from './image.entity';

const ProductSchema = defineEntity({
  name: 'Product',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string(),
    description: p.string().nullable(),
    price: p.decimal('number').precision(10).scale(2),
    stock: p.integer(),
    category: () => p.manyToOne(Category).inversedBy('products'),
    images: () => p.oneToMany(Image).mappedBy('product'),
  },
});

export class Product extends ProductSchema.class {}
ProductSchema.setClass(Product);
