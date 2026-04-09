import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CallStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CallsService {
  constructor(private readonly prisma: PrismaService) {}

  private includeUsers = {
    caller: { select: { id: true, name: true, email: true, avatar: true } },
    callee: { select: { id: true, name: true, email: true, avatar: true } },
  };

  async createCall(callerId: string, calleeId: string, type: 'VOICE' | 'VIDEO') {
    if (callerId === calleeId) throw new BadRequestException('Não pode ligar para si mesmo.');

    return this.prisma.callSession.create({
      data: { callerId, calleeId, type },
      include: this.includeUsers,
    });
  }

  async listByUser(userId: string) {
    return this.prisma.callSession.findMany({
      where: { OR: [{ callerId: userId }, { calleeId: userId }] },
      include: this.includeUsers,
      orderBy: { startedAt: 'desc' },
      take: 50,
    });
  }

  async answerCall(callId: string) {
    const call = await this.findOrFail(callId);
    if (call.status !== 'RINGING') throw new BadRequestException('Ligação não está tocando.');

    return this.prisma.callSession.update({
      where: { id: callId },
      data: { status: 'ONGOING', answeredAt: new Date() },
      include: this.includeUsers,
    });
  }

  async endCall(callId: string, reason?: 'ENDED' | 'MISSED' | 'DECLINED') {
    const call = await this.findOrFail(callId);
    const status = reason ?? (call.status === 'RINGING' ? 'MISSED' : 'ENDED');
    const duration = call.answeredAt
      ? Math.floor((Date.now() - call.answeredAt.getTime()) / 1000)
      : null;

    return this.prisma.callSession.update({
      where: { id: callId },
      data: { status, endedAt: new Date(), duration },
      include: this.includeUsers,
    });
  }

  private async findOrFail(callId: string) {
    const call = await this.prisma.callSession.findUnique({ where: { id: callId } });
    if (!call) throw new NotFoundException('Ligação não encontrada.');
    return call;
  }
}
