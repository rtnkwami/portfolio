import { Collection } from '@mikro-orm/core';
import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';
import { Order } from './order.entity';
import { randomUUID } from 'crypto';

@Entity()
export class User extends BaseEntity<'avatar'> {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: 'string' })
  name: string;

  @Property({ type: 'string' })
  email: string;

  @Property({ type: 'string' })
  avatar?: string;

  @OneToMany(() => Order, (order) => order.user)
  orders = new Collection<Order>(this);

  constructor(name: string, email: string) {
    super();
    this.name = name;
    this.email = email;
  }
}
