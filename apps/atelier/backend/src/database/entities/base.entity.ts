import { Property } from '@mikro-orm/decorators/legacy';
import { DateTimeType, OptionalProps } from '@mikro-orm/core';

export abstract class BaseEntity<Optional = never> {
  [OptionalProps]?: 'createdAt' | 'updatedAt' | Optional;

  @Property({ type: DateTimeType, defaultRaw: 'now()' })
  createdAt: Date = new Date();

  @Property({
    type: DateTimeType,
    onUpdate: () => new Date(),
    defaultRaw: 'now()',
  })
  updatedAt: Date = new Date();
}
