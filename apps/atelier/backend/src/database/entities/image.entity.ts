import { defineEntity, p } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Product } from './product.entity';

const ImageSchema = defineEntity({
  name: 'Image',
  properties: {
    id: p
      .uuid()
      .primary()
      .onCreate(() => randomUUID()),
    url: p.string(),
    product: () => p.manyToOne(Product).inversedBy('images'),
  },
});

export class Image extends ImageSchema.class {}
ImageSchema.setClass(Image);
