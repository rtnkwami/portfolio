import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  // Patch,
} from '@nestjs/common';
import { OrderService } from './order.service';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/decorators/user.decorator';
import { ZodValidationPipe } from 'src/pipes/request.validation.pipe';
import z from 'zod';
import { OrderSearchSchema } from '@atelier/contracts/schemas';
import type { OrderSearchParams } from '@atelier/contracts/types';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@User() userId: string) {
    return this.orderService.createOrder(userId);
  }

  @Get()
  @UsePipes(new ZodValidationPipe(OrderSearchSchema))
  search(@User() userId: string, @Query() query: OrderSearchParams) {
    return this.orderService.search(userId, query);
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(z.uuid()))
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // } this function will only be used by admins when implemented.
}
