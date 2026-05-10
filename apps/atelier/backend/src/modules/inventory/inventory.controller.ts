import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateCategoryDto } from './dto/requests.dto';
import { CategoryParams } from './dto/requests.dto';
import { ZodResponse } from 'nestjs-zod';
import { CategoryResponse } from './dto/responses.dto';
import { getAllCategoriesResponse } from './dto/responses.dto';
import { ApiNotFoundResponse, ApiOperation } from '@nestjs/swagger';
import { StandardErrorResponseDto } from '../shared/errors.dto';
import { GeneralApiErrorResponses } from '../shared/errors.decorator';

@GeneralApiErrorResponses()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // --- CATEGORY ENDPOINTS ---

  @ApiOperation({ operationId: 'createCategory' })
  @Post('categories')
  @ZodResponse({ status: 201, type: CategoryResponse })
  public async createCategory(@Body() data: CreateCategoryDto) {
    return this.inventoryService.createCategory(data);
  }

  @ApiOperation({ operationId: 'getAllCategories' })
  @Get('categories')
  @ZodResponse({ status: 200, type: getAllCategoriesResponse })
  public async getAllCategories() {
    const categories = await this.inventoryService.getAllCategories();
    return { categories };
  }

  @ApiOperation({ operationId: 'getCategory' })
  @ApiNotFoundResponse({ type: StandardErrorResponseDto })
  @Get('categories/:id')
  @ZodResponse({ status: 200, type: CategoryResponse })
  public async getCategory(@Param() params: CategoryParams) {
    return this.inventoryService.getCategory(params.id);
  }

  @ApiOperation({ operationId: 'deleteCategory' })
  @ApiNotFoundResponse({ type: StandardErrorResponseDto })
  @Delete('categories/:id')
  @ZodResponse({ status: 200, type: CategoryResponse })
  public async deleteCategory(@Param() params: CategoryParams) {
    return this.inventoryService.deleteCategory(params.id);
  }

  // --- PRODUCT ENDPOINTS ---
}
