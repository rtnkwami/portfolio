import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ZodInterceptorError } from './filters/zod-interceptor.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new ZodInterceptorError());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
