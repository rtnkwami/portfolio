import { Migration } from '@mikro-orm/migrations';

export class Migration20260509190840 extends Migration {
  override up(): void | Promise<void> {
    this.addSql(
      `create table "product" ("id" uuid not null, "name" varchar(255) not null, "description" varchar(255) null, "price" numeric(10,2) not null, "stock" int not null, "category_id" uuid not null, primary key ("id"));`,
    );

    this.addSql(
      `create table "image" ("id" uuid not null, "url" varchar(255) not null, "product_id" uuid not null, primary key ("id"));`,
    );

    this.addSql(
      `alter table "product" add constraint "product_category_id_foreign" foreign key ("category_id") references "category" ("id");`,
    );

    this.addSql(
      `alter table "image" add constraint "image_product_id_foreign" foreign key ("product_id") references "product" ("id");`,
    );
  }

  override down(): void | Promise<void> {
    this.addSql(
      `alter table "image" drop constraint "image_product_id_foreign";`,
    );

    this.addSql(`drop table if exists "product" cascade;`);
    this.addSql(`drop table if exists "image" cascade;`);
  }
}
