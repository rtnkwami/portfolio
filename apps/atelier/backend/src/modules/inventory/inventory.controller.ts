import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import {
  CreateCategoryDto,
  CreateProductDto,
  ParamsDto,
  ProductSearchParams,
  UpdateCategoryDto,
  UpdateProductDto,
} from './dto/requests.dto';
import { CategoryParams } from './dto/requests.dto';
import {
  CategoryResponse,
  DeleteResponse,
  ImageUploadResponse,
  PrivateProduct,
  ProductSearchResults,
} from './dto/responses.dto';
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

  @ApiEndpoint({
    operationId: 'createProduct',
    status: 201,
    type: PrivateProduct,
  })
  @ApiErrorResponses('Conflict', 'BadRequest')
  @Post('products')
  public async createProduct(@Body() data: CreateProductDto) {
    return this.inventoryService.createProduct(data);
  }

  @ApiEndpoint({
    operationId: 'updateProduct',
    status: 200,
    type: PrivateProduct,
  })
  @ApiErrorResponses('NotFound', 'BadRequest')
  @Patch('products/:id')
  public async updateProduct(
    @Param() params: ParamsDto,
    @Body() data: UpdateProductDto,
  ) {
    return this.inventoryService.updateProduct(params.id, data);
  }

  @ApiEndpoint({
    operationId: 'searchProducts',
    status: 200,
    type: ProductSearchResults,
  })
  @ApiErrorResponses('BadRequest')
  @Get('products')
  public async searchProducts(@Query() query: ProductSearchParams) {
    return this.inventoryService.searchProducts(query);
  }

  @ApiEndpoint({
    operationId: 'getProduct',
    status: 200,
    type: PrivateProduct,
  })
  @ApiErrorResponses('NotFound')
  @Get('products/:id')
  public async getProduct(@Param() params: ParamsDto) {
    return this.inventoryService.getProduct(params.id);
  }

  @ApiEndpoint({
    operationId: 'getImageUploadLink',
    status: 200,
    type: ImageUploadResponse,
  })
  @ApiErrorResponses('NotFound')
  @Get('products/:id/images')
  public async getImageUploadLink(@Param() params: ParamsDto) {
    return this.inventoryService.generateImageUploadLink(params.id);
  }

  @ApiEndpoint({
    operationId: 'deleteProduct',
    status: 200,
    type: DeleteResponse,
  })
  @ApiErrorResponses('NotFound')
  @Delete('products/:id')
  public async deleteProduct(@Param() params: ParamsDto) {
    return this.inventoryService.deleteProduct(params.id);
  }
}
