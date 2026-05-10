import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { dump } from 'js-yaml';
import {
  InternalServerErrorResponseDto,
  StandardErrorResponseDto,
  ValidationResponseDto,
} from './modules/shared/errors.dto';

async function openapiGen() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const openApiDoc = cleanupOpenApiDoc(
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Atelier Main API')
        .setVersion('1.0')
        .build(),
      {
        extraModels: [
          StandardErrorResponseDto,
          ValidationResponseDto,
          InternalServerErrorResponseDto,
        ],
      },
    ),
  );
  writeFileSync(resolve(__dirname, '../../openapi.yaml'), dump(openApiDoc));
  await app.close();
}
void openapiGen();
