import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { InternalServerErrorDto, StandardErrorDto } from './errors.dto';

type ApiEndpoint = {
  operationId: string;
  status: number;
  type: any;
};

export const ApiEndpoint = ({ operationId, status, type }: ApiEndpoint) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  applyDecorators(ApiOperation({ operationId }), ZodResponse({ status, type }));

type ErrorResponse = 'NotFound' | 'Conflict' | 'BadRequest';

const errorMap = {
  NotFound: ApiNotFoundResponse({ type: StandardErrorDto }),
  Conflict: ApiConflictResponse({ type: StandardErrorDto }),
  BadRequest: ApiBadRequestResponse({ type: StandardErrorDto }),
};
// select which errors are applicable to a controller function
export const ApiErrorResponses = (...errors: ErrorResponse[]) =>
  applyDecorators(
    ApiInternalServerErrorResponse({ type: InternalServerErrorDto }),
    ...errors.map((err) => errorMap[err]),
  );
