import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  private selectPublic = {
    id: true,
    email: true,
    name: true,
    avatar: true,
    bio: true,
    phone: true,
    status: true,
    lastSeenAt: true,
    createdAt: true,
  };

  async create(dto: { email: string; name: string; password: string; phone?: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('E-mail já cadastrado.');
    }

    const passwordHash = await hash(dto.password, 12);

    return this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
        phone: dto.phone,
      },
      select: this.selectPublic,
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: this.selectPublic,
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
  }

  async updateProfile(id: string, dto: { name?: string; bio?: string; avatar?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: this.selectPublic,
    });
  }

  async updateStatus(id: string, status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY') {
    return this.prisma.user.update({
      where: { id },
      data: { status, lastSeenAt: new Date() },
      select: this.selectPublic,
    });
  }

  async searchUsers(query: string, excludeId?: string) {
    return this.prisma.user.findMany({
      where: {
        AND: [
          { id: { not: excludeId } },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
        ],
      },
      select: this.selectPublic,
      take: 20,
    });
  }
}
