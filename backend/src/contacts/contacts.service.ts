import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  private includeContact = {
    contact: { select: { id: true, name: true, email: true, avatar: true, status: true, lastSeenAt: true } },
  };

  async getContacts(userId: string) {
    return this.prisma.contact.findMany({
      where: { userId, isBlocked: false },
      include: this.includeContact,
      orderBy: { contact: { name: 'asc' } },
    });
  }

  async getFavorites(userId: string) {
    return this.prisma.contact.findMany({
      where: { userId, isFavorite: true, isBlocked: false },
      include: this.includeContact,
    });
  }

  async addContact(userId: string, contactId: string, nickname?: string) {
    if (userId === contactId) throw new ConflictException('Não pode adicionar a si mesmo.');

    const existing = await this.prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    });
    if (existing) throw new ConflictException('Contato já adicionado.');

    return this.prisma.contact.create({
      data: { userId, contactId, nickname },
      include: this.includeContact,
    });
  }

  async toggleFavorite(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    });
    if (!contact) throw new NotFoundException('Contato não encontrado.');

    return this.prisma.contact.update({
      where: { id: contact.id },
      data: { isFavorite: !contact.isFavorite },
      include: this.includeContact,
    });
  }

  async blockContact(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    });
    if (!contact) throw new NotFoundException('Contato não encontrado.');

    return this.prisma.contact.update({
      where: { id: contact.id },
      data: { isBlocked: !contact.isBlocked },
      include: this.includeContact,
    });
  }

  async removeContact(userId: string, contactId: string) {
    const contact = await this.prisma.contact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    });
    if (!contact) throw new NotFoundException('Contato não encontrado.');

    return this.prisma.contact.delete({ where: { id: contact.id } });
  }
}
