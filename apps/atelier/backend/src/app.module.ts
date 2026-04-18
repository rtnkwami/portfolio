import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import dbConfig from './database/mikro-orm.config';

@Module({
  imports: [
    MikroOrmModule.forRoot({
      ...dbConfig,
      entities: [],
      entitiesTs: [],
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
