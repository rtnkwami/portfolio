import { defineEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Product } from './product.entity';

const CategorySchema = defineEntity({
  name: 'Category',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    name: p.string(),
    products: () => p.oneToMany(Product).mappedBy('category'),
  },
});

export class Category extends CategorySchema.class {}
CategorySchema.setClass(Category);
