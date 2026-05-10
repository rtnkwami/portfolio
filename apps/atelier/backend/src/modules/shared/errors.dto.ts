import { ApiProperty } from '@nestjs/swagger';

export class StandardErrorResponseDto {
  @ApiProperty({ enum: ['StandardError'], default: 'StandardError' })
  type!: 'StandardError';

  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  error!: string;

  @ApiProperty()
  message!: string;
}

export class ValidationResponseDto {
  @ApiProperty({ enum: ['ValidationError'], default: 'ValidationError' })
  type!: 'ValidationError';

  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  error!: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  errors!: unknown[];
}

export class InternalServerErrorResponseDto {
  @ApiProperty({
    enum: ['InternalServerError'],
    default: 'InternalServerError',
  })
  type!: 'InternalServerError';

  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  error!: string;
}
