import { Collection, DateTimeType } from '@mikro-orm/core';
import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/decorators/legacy';
import { ReservationItem } from './reservation-item.entity';
import { randomUUID } from 'crypto';

@Entity()
export class Reservation {
  @PrimaryKey({ type: 'uuid' })
  id: string = randomUUID();

  @Property({ type: DateTimeType })
  createdAt: Date = new Date();

  @Property({
    type: DateTimeType,
    onCreate: () => new Date(Date.now() + 15 * 60 * 1000),
  })
  expiresAt: Date;

  @OneToMany(() => ReservationItem, (item) => item.reservation, {
    orphanRemoval: true,
  })
  items = new Collection<ReservationItem>(this);

  constructor() {
    this.expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  }
}
