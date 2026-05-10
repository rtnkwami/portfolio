import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  StandardErrorResponseDto,
  ValidationResponseDto,
  InternalServerErrorResponseDto,
} from './errors.dto';

export const GeneralApiErrorResponses = () =>
  applyDecorators(
    ApiInternalServerErrorResponse({ type: InternalServerErrorResponseDto }),
    ApiResponse({
      status: 400,
      schema: {
        oneOf: [
          { $ref: getSchemaPath(StandardErrorResponseDto) },
          { $ref: getSchemaPath(ValidationResponseDto) },
        ],
        discriminator: {
          propertyName: 'type',
          mapping: {
            StandardError: getSchemaPath(StandardErrorResponseDto),
            ValidationError: getSchemaPath(ValidationResponseDto),
          },
        },
      },
    }),
  );
