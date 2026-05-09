import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { ZodValidationPipe } from 'src/pipes/request.validation.pipe';
import z from 'zod';
import {
  CreateProductSchema,
  SearchProductSchema,
} from '@atelier/contracts/schemas';
import type {
  CreateProductParams,
  SearchProductParams,
  UpdateProductParams,
} from '@atelier/contracts/types';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  create(@Body() data: CreateProductParams) {
    return this.inventoryService.create(data);
  }

  @Get('search')
  @UsePipes(new ZodValidationPipe(z.string()))
  async quickSearch(@Query('name') name: string) {
    return await this.inventoryService.quickSearch(name);
  }

  @Get('categories')
  async getCategories() {
    return await this.inventoryService.getProductCategories();
  }

  @Get()
  @UsePipes(new ZodValidationPipe(SearchProductSchema))
  search(@Query() query: SearchProductParams) {
    return this.inventoryService.search(query);
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(z.uuid()))
  getProduct(@Param('id') id: string) {
    return this.inventoryService.getProduct(id);
  }

  @Patch(':id')
  @UsePipes(new ZodValidationPipe(z.uuid()))
  updateProduct(@Param('id') id: string, @Body() data: UpdateProductParams) {
    return this.inventoryService.updateProduct(id, data);
  }

  @Delete(':id')
  @UsePipes(new ZodValidationPipe(z.uuid()))
  deleteProduct(@Param('id') id: string) {
    return this.inventoryService.deleteProduct(id);
  }
}
