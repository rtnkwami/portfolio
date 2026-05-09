import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from 'src/database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Category, Product])],
  controllers: [InventoryController],
  providers: [InventoryService],
})
export class InventoryModule {}
