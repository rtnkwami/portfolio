import { BaseEntity, DecimalType, type Ref, ref } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Product } from './product.entity';
import { randomUUID } from 'crypto';
import {
  Property,
  PrimaryKey,
  Entity,
  ManyToOne,
} from '@mikro-orm/decorators/legacy';

@Entity()
export class OrderItem extends BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'int' })
  quantity: number;

  @Property({
    type: new DecimalType('number'),
    precision: 10,
    scale: 2,
  })
  price: number;

  @ManyToOne({ entity: () => Order, ref: true })
  order: Ref<Order>;

  @ManyToOne({ entity: () => Product, ref: true })
  product: Ref<Product>;

  constructor(order: Order, product: Product, quantity: number, price: number) {
    super();
    this.order = ref(order);
    this.product = ref(product);
    this.quantity = quantity;
    this.price = price;
  }
}
