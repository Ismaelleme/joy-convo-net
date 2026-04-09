import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  private includeMembers = {
    members: {
      include: { user: { select: { id: true, name: true, avatar: true, status: true } } },
    },
  };

  async getUserChats(userId: string) {
    return this.prisma.chat.findMany({
      where: { members: { some: { userId } } },
      include: {
        ...this.includeMembers,
        messages: { orderBy: { createdAt: 'desc' as const }, take: 1 },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createDirectChat(userId: string, targetUserId: string) {
    const existing = await this.prisma.chat.findFirst({
      where: {
        isGroup: false,
        AND: [
          { members: { some: { userId } } },
          { members: { some: { userId: targetUserId } } },
        ],
      },
      include: this.includeMembers,
    });

    if (existing) return existing;

    return this.prisma.chat.create({
      data: {
        isGroup: false,
        members: {
          create: [{ userId }, { userId: targetUserId }],
        },
      },
      include: this.includeMembers,
    });
  }

  async createGroupChat(userId: string, name: string, memberIds: string[]) {
    const allMembers = [...new Set([userId, ...memberIds])];

    return this.prisma.chat.create({
      data: {
        name,
        isGroup: true,
        members: {
          create: allMembers.map((id) => ({
            userId: id,
            isAdmin: id === userId,
          })),
        },
      },
      include: this.includeMembers,
    });
  }

  async getChatMessages(chatId: string, userId: string, cursor?: string, take = 50) {
    await this.verifyMembership(chatId, userId);

    return this.prisma.message.findMany({
      where: { chatId },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
        replyTo: { select: { id: true, content: true, sender: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    });
  }

  async sendMessage(chatId: string, senderId: string, content: string, type = 'TEXT', replyToId?: string) {
    await this.verifyMembership(chatId, senderId);

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        content,
        type: type as any,
        replyToId,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true } },
      },
    });

    await this.prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return message;
  }

  async markAsRead(chatId: string, userId: string) {
    await this.verifyMembership(chatId, userId);

    return this.prisma.message.updateMany({
      where: { chatId, senderId: { not: userId }, status: { not: 'READ' } },
      data: { status: 'READ' },
    });
  }

  private async verifyMembership(chatId: string, userId: string) {
    const member = await this.prisma.chatMember.findUnique({
      where: { chatId_userId: { chatId, userId } },
    });
    if (!member) throw new ForbiddenException('Você não é membro deste chat.');
  }
}
