import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/requests.dto';
import { CategoryParams } from './dto/requests.dto';
import { CategoryResponse } from './dto/responses.dto';
import { getAllCategoriesResponse } from './dto/responses.dto';
import { ApiEndpoint, ApiErrorResponses } from '../shared/openapi.decorator';

@ApiErrorResponses()
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // --- CATEGORY ENDPOINTS ---

  @ApiEndpoint({
    operationId: 'createCategory',
    status: 201,
    type: CategoryResponse,
  })
  @Post('categories')
  public async createCategory(@Body() data: CreateCategoryDto) {
    return this.inventoryService.createCategory(data);
  }

  @ApiEndpoint({
    operationId: 'updateCategory',
    status: 200,
    type: CategoryResponse,
  })
  @Patch('categories/:id')
  public updateCategory(
    @Param() params: CategoryParams,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.inventoryService.updateCategory(params.id, data.name);
  }

  @ApiEndpoint({
    operationId: 'getAllCategories',
    status: 200,
    type: getAllCategoriesResponse,
  })
  @Get('categories')
  public async getAllCategories() {
    const categories = await this.inventoryService.getAllCategories();
    return { categories };
  }

  @ApiEndpoint({
    operationId: 'getCategory',
    status: 200,
    type: CategoryResponse,
  })
  @ApiErrorResponses('NotFound')
  @Get('categories/:id')
  public async getCategory(@Param() params: CategoryParams) {
    return this.inventoryService.getCategory(params.id);
  }

  @ApiEndpoint({
    operationId: 'deleteCategory',
    status: 200,
    type: CategoryResponse,
  })
  @ApiErrorResponses('NotFound', 'Conflict')
  @Delete('categories/:id')
  public async deleteCategory(@Param() params: CategoryParams) {
    return this.inventoryService.deleteCategory(params.id);
  }

  // --- PRODUCT ENDPOINTS ---
}
