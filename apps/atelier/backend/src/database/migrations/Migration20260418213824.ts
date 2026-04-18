import { Migration } from '@mikro-orm/migrations';

export class Migration20260418213824 extends Migration {

  override up(): void | Promise<void> {
    this.addSql(`create table "product" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "description" varchar(255) not null, "category" varchar(255) not null, "price" numeric(10,2) not null, "stock" int not null, "images" jsonb not null, primary key ("id"));`);

    this.addSql(`create table "reservation" ("id" uuid not null, "created_at" timestamptz not null, "expires_at" timestamptz not null, primary key ("id"));`);

    this.addSql(`create table "reservation_item" ("id" uuid not null, "product_id" uuid not null, "quantity" int not null, "reservation_id" uuid not null, primary key ("id"));`);

    this.addSql(`create table "user" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "name" varchar(255) not null, "email" varchar(255) not null, "avatar" varchar(255) not null, primary key ("id"));`);

    this.addSql(`create table "order" ("id" uuid not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "status" text not null default 'pending_payment', "total" numeric(10,2) not null, "user_id" uuid not null, primary key ("id"));`);

    this.addSql(`create table "order_item" ("id" uuid not null, "quantity" int not null, "price" numeric(10,2) not null, "order_id" uuid not null, "product_id" uuid not null, primary key ("id"));`);

    this.addSql(`alter table "reservation_item" add constraint "reservation_item_product_id_foreign" foreign key ("product_id") references "product" ("id");`);
    this.addSql(`alter table "reservation_item" add constraint "reservation_item_reservation_id_foreign" foreign key ("reservation_id") references "reservation" ("id");`);

    this.addSql(`alter table "order" add constraint "order_user_id_foreign" foreign key ("user_id") references "user" ("id");`);
    this.addSql(`alter table "order" add constraint "order_status_check" check ("status" in ('pending_payment', 'paid', 'cancelled', 'completed'));`);

    this.addSql(`alter table "order_item" add constraint "order_item_order_id_foreign" foreign key ("order_id") references "order" ("id");`);
    this.addSql(`alter table "order_item" add constraint "order_item_product_id_foreign" foreign key ("product_id") references "product" ("id");`);
  }

  override down(): void | Promise<void> {
    this.addSql(`alter table "reservation_item" drop constraint "reservation_item_product_id_foreign";`);
    this.addSql(`alter table "order_item" drop constraint "order_item_product_id_foreign";`);
    this.addSql(`alter table "reservation_item" drop constraint "reservation_item_reservation_id_foreign";`);
    this.addSql(`alter table "order" drop constraint "order_user_id_foreign";`);
    this.addSql(`alter table "order_item" drop constraint "order_item_order_id_foreign";`);

    this.addSql(`drop table if exists "product" cascade;`);
    this.addSql(`drop table if exists "reservation" cascade;`);
    this.addSql(`drop table if exists "reservation_item" cascade;`);
    this.addSql(`drop table if exists "user" cascade;`);
    this.addSql(`drop table if exists "order" cascade;`);
    this.addSql(`drop table if exists "order_item" cascade;`);
  }

}
