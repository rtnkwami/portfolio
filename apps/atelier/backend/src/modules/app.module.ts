import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import dbConfig from 'src/database/mikro-orm.config';
import { InventoryModule } from './inventory/inventory.module';
import { CartModule } from './cart/cart.module';
import { ConfigModule } from '@nestjs/config';
import { envValidate } from '../env.validation';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: envValidate }),
    MikroOrmModule.forRoot({
      ...dbConfig,
      entities: [],
      entitiesTs: [],
      autoLoadEntities: true,
    }),
    InventoryModule,
    CartModule,
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'inventory/*', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
