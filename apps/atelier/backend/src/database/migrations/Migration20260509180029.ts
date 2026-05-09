import { Migration } from '@mikro-orm/migrations';

export class Migration20260509180029 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "category" ("id" uuid not null, "name" varchar(255) not null, primary key ("id"));`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists "category" cascade;`);
  }
}
