import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Marketplace')
@Controller('marketplace')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MarketplaceController {
  constructor(private readonly marketplaceService: MarketplaceService) {}

  @Get()
  list(@Query('category') category?: string, @Query('cursor') cursor?: string) {
    return this.marketplaceService.listProducts(category, cursor);
  }

  @Get('mine')
  mine(@CurrentUser('sub') userId: string) {
    return this.marketplaceService.getMyProducts(userId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.marketplaceService.getProduct(id);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: any) {
    return this.marketplaceService.createProduct(userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() dto: any) {
    return this.marketplaceService.updateProduct(id, userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.marketplaceService.deleteProduct(id, userId);
  }
}
