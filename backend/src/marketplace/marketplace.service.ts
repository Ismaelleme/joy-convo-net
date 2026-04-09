import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketplaceService {
  constructor(private readonly prisma: PrismaService) {}

  private includeSeller = {
    seller: { select: { id: true, name: true, avatar: true } },
  };

  async listProducts(category?: string, cursor?: string, take = 20) {
    return this.prisma.marketProduct.findMany({
      where: { isActive: true, ...(category ? { category } : {}) },
      include: this.includeSeller,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

  async getProduct(id: string) {
    const product = await this.prisma.marketProduct.findUnique({
      where: { id },
      include: this.includeSeller,
    });
    if (!product) throw new NotFoundException('Produto não encontrado.');
    return product;
  }

  async createProduct(sellerId: string, dto: {
    title: string; description?: string; price: number;
    imageUrl?: string; category?: string;
  }) {
    return this.prisma.marketProduct.create({
      data: { sellerId, ...dto },
      include: this.includeSeller,
    });
  }

  async updateProduct(id: string, userId: string, dto: Record<string, any>) {
    const product = await this.getProduct(id);
    if (product.sellerId !== userId) throw new ForbiddenException('Sem permissão.');

    return this.prisma.marketProduct.update({
      where: { id },
      data: dto,
      include: this.includeSeller,
    });
  }

  async deleteProduct(id: string, userId: string) {
    const product = await this.getProduct(id);
    if (product.sellerId !== userId) throw new ForbiddenException('Sem permissão.');
    return this.prisma.marketProduct.delete({ where: { id } });
  }

  async getMyProducts(userId: string) {
    return this.prisma.marketProduct.findMany({
      where: { sellerId: userId },
      include: this.includeSeller,
      orderBy: { createdAt: 'desc' },
    });
  }
}
