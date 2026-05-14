import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  error!: string;

  @ApiProperty({ type: 'array', items: { type: 'object' } })
  errors!: unknown[];
}

export class StandardErrorDto {
  @ApiProperty()
  error!: string;

  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;
}

export class InternalServerErrorDto {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;
}
