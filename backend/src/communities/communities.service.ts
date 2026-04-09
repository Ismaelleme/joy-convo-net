import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommunitiesService {
  constructor(private readonly prisma: PrismaService) {}

  private includeDetails = {
    owner: { select: { id: true, name: true, avatar: true } },
    _count: { select: { members: true } },
  };

  async listPublic() {
    return this.prisma.community.findMany({
      where: { isPublic: true },
      include: this.includeDetails,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserCommunities(userId: string) {
    return this.prisma.community.findMany({
      where: { members: { some: { userId } } },
      include: this.includeDetails,
    });
  }

  async create(ownerId: string, dto: { name: string; description?: string; isPublic?: boolean }) {
    return this.prisma.community.create({
      data: {
        ...dto,
        ownerId,
        members: { create: { userId: ownerId, role: 'admin' } },
      },
      include: this.includeDetails,
    });
  }

  async join(communityId: string, userId: string) {
    const community = await this.prisma.community.findUnique({ where: { id: communityId } });
    if (!community) throw new NotFoundException('Comunidade não encontrada.');

    const existing = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    if (existing) throw new ConflictException('Já é membro.');

    return this.prisma.communityMember.create({ data: { communityId, userId } });
  }

  async leave(communityId: string, userId: string) {
    const member = await this.prisma.communityMember.findUnique({
      where: { communityId_userId: { communityId, userId } },
    });
    if (!member) throw new NotFoundException('Não é membro.');

    return this.prisma.communityMember.delete({ where: { id: member.id } });
  }

  async delete(communityId: string, userId: string) {
    const community = await this.prisma.community.findUnique({ where: { id: communityId } });
    if (!community) throw new NotFoundException('Comunidade não encontrada.');
    if (community.ownerId !== userId) throw new ForbiddenException('Apenas o dono pode excluir.');

    return this.prisma.community.delete({ where: { id: communityId } });
  }
}
