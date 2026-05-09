import { Collection, DecimalType, type Ref, ref } from '@mikro-orm/core';
import {
  Property,
  PrimaryKey,
  Entity,
  ManyToOne,
  Enum,
  OneToMany,
} from '@mikro-orm/decorators/legacy';
import { BaseEntity } from './base.entity';
import { randomUUID } from 'crypto';
import { OrderItem } from './order-item.entity';
import { User } from './user.entity';

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Entity()
export class Order extends BaseEntity<'status'> {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Enum({ items: () => OrderStatus, default: OrderStatus.PENDING_PAYMENT })
  status: OrderStatus;

  @Property({
    type: new DecimalType('number'),
    precision: 10,
    scale: 2,
  })
  total: number;

  @OneToMany(() => OrderItem, (item) => item.order)
  items = new Collection<OrderItem>(this);

  @ManyToOne({ entity: () => User, ref: true })
  user: Ref<User>;

  constructor(
    user: User,
    total: number,
    status: OrderStatus = OrderStatus.PENDING_PAYMENT,
  ) {
    super();
    this.user = ref(user);
    this.total = total;
    this.status = status;
  }
}
