import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import dbConfig from 'src/database/mikro-orm.config';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CartModule } from './modules/cart/cart.module';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...dbConfig,
      entities: [],
      entitiesTs: [],
      autoLoadEntities: true,
    }),
    InventoryModule,
    CartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
