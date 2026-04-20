import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from 'src/modules/cart/cart.module';
import { InventoryModule } from 'src/modules/inventory/inventory.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from 'src/database/entities/order.entity';
import { OrderItem } from 'src/database/entities/order-item.entity';

@Module({
  imports: [
    CartModule,
    InventoryModule,
    MikroOrmModule.forFeature([Order, OrderItem]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
