import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from 'src/database/entities/category.entity';
import { Product } from 'src/database/entities/product.entity';
import { Image } from 'src/database/entities/image.entity';
import { S3Service } from './aws-s3.service';

@Module({
  imports: [MikroOrmModule.forFeature([Category, Product, Image])],
  controllers: [InventoryController],
  providers: [InventoryService, S3Service],
})
export class InventoryModule {}
