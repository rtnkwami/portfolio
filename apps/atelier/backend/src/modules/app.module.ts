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
import { LoggerModule } from 'nestjs-pino';
import { Request, Response } from 'express';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: envValidate }),
    LoggerModule.forRoot({
      pinoHttp: {
        serializers: {
          res: (res: Response) => ({
            statusCode: res.statusCode,
          }),
          req: (req: Request) => ({
            id: req.id,
            method: req.method,
            url: req.url,
            query: req.query,
            params: req.params,
            userAgent: req.headers['user-agent'],
          }),
        },
      },
    }),
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
      .exclude({ path: 'inventory', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
