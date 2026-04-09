import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  async getEvents(userId: string, startDate?: string, endDate?: string) {
    return this.prisma.scheduleEvent.findMany({
      where: {
        userId,
        ...(startDate && endDate
          ? { startDate: { gte: new Date(startDate), lte: new Date(endDate) } }
          : {}),
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async getEvent(eventId: string, userId: string) {
    const event = await this.prisma.scheduleEvent.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Evento não encontrado.');
    if (event.userId !== userId) throw new ForbiddenException('Sem permissão.');
    return event;
  }

  async createEvent(userId: string, dto: {
    title: string;
    description?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    allDay?: boolean;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    color?: string;
    reminder?: number;
  }) {
    return this.prisma.scheduleEvent.create({
      data: {
        userId,
        title: dto.title,
        description: dto.description,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        allDay: dto.allDay ?? false,
        priority: (dto.priority as any) ?? 'MEDIUM',
        color: dto.color,
        reminder: dto.reminder,
      },
    });
  }

  async updateEvent(eventId: string, userId: string, dto: Record<string, any>) {
    await this.getEvent(eventId, userId);

    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);

    return this.prisma.scheduleEvent.update({ where: { id: eventId }, data });
  }

  async deleteEvent(eventId: string, userId: string) {
    await this.getEvent(eventId, userId);
    return this.prisma.scheduleEvent.delete({ where: { id: eventId } });
  }

  async updateStatus(eventId: string, userId: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') {
    await this.getEvent(eventId, userId);
    return this.prisma.scheduleEvent.update({ where: { id: eventId }, data: { status } });
  }
}
