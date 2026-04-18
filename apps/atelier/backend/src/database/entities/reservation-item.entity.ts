import {
  Entity,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { type Ref, ref } from '@mikro-orm/core';
import { randomUUID } from 'crypto';
import { Reservation } from './reservation.entity';
import { Product } from './product.entity';

@Entity()
export class ReservationItem {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @ManyToOne({ entity: () => Product, ref: true })
  product: Ref<Product>;

  @Property({ type: 'int' })
  quantity: number;

  @ManyToOne({ entity: () => Reservation, ref: true })
  reservation: Ref<Reservation>;

  constructor(product: Product, reservation: Reservation, quantity: number) {
    this.product = ref(product);
    this.reservation = ref(reservation);
    this.quantity = quantity;
  }
}
