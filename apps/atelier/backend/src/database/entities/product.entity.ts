import { Collection, DecimalType, JsonType } from '@mikro-orm/core';
import {
  OneToMany,
  PrimaryKey,
  Property,
  Entity,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';
import { randomUUID } from 'crypto';
import { ReservationItem } from './reservation-item.entity';
import { OrderItem } from './order-item.entity';

@Entity()
export class Product extends BaseEntity<'description' | 'images'> {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string' })
  name: string;

  @Property({ type: 'string' })
  description?: string;

  @Property({ type: 'string' })
  category: string;

  @Property({
    type: new DecimalType('number'),
    precision: 10,
    scale: 2,
  })
  price: number;

  @Property({ type: 'int' })
  stock: number;

  @Property({ type: JsonType })
  images: string[] = [];

  @OneToMany(() => ReservationItem, (reservation) => reservation.product)
  reservations = new Collection<ReservationItem>(this);

  @OneToMany(() => OrderItem, (order) => order.product)
  orders = new Collection<OrderItem>(this);

  constructor(name: string, category: string, price: number, stock: number) {
    super();
    this.name = name;
    this.category = category;
    this.price = price;
    this.stock = stock;
  }
}
