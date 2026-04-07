import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CallStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCallDto } from './dto/create-call.dto';
import { EndCallDto } from './dto/end-call.dto';

@Injectable()
export class CallsService {
  constructor(private readonly prisma: PrismaService) {}

  private includeUsers: Prisma.CallSessionInclude = {
    caller: { select: { id: true, name: true, email: true } },
    callee: { select: { id: true, name: true, email: true } },
  };

  async createCall(dto: CreateCallDto) {
    if (dto.callerId === dto.calleeId) {
      throw new BadRequestException('Não é possível ligar para si mesmo.');
    }

    const [caller, callee] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: dto.callerId } }),
      this.prisma.user.findUnique({ where: { id: dto.calleeId } }),
    ]);

    if (!caller || !callee) {
      throw new NotFoundException('Usuário de origem ou destino não encontrado.');
    }

    return this.prisma.callSession.create({
      data: {
        callerId: dto.callerId,
        calleeId: dto.calleeId,
        type: dto.type,
        metadata: dto.metadata,
      },
      include: this.includeUsers,
    });
  }

  async listByUser(userId: string) {
    return this.prisma.callSession.findMany({
      where: {
        OR: [{ callerId: userId }, { calleeId: userId }],
      },
      include: this.includeUsers,
      orderBy: { startedAt: 'desc' },
    });
  }

  async answerCall(callId: string) {
    const call = await this.prisma.callSession.findUnique({ where: { id: callId } });

    if (!call) {
      throw new NotFoundException('Ligação não encontrada.');
    }

    if (call.status !== 'RINGING') {
      throw new BadRequestException('A ligação não está tocando.');
    }

    return this.prisma.callSession.update({
      where: { id: callId },
      data: {
        status: 'ONGOING',
        answeredAt: new Date(),
      },
      include: this.includeUsers,
    });
  }

  async endCall(callId: string, dto: EndCallDto) {
    const call = await this.prisma.callSession.findUnique({ where: { id: callId } });

    if (!call) {
      throw new NotFoundException('Ligação não encontrada.');
    }

    const reason = dto.reason ?? EndReasonDefault(call.status);

    return this.prisma.callSession.update({
      where: { id: callId },
      data: {
        status: reason,
        endedAt: new Date(),
      },
      include: this.includeUsers,
    });
  }
}

function EndReasonDefault(status: CallStatus): CallStatus {
  if (status === 'RINGING') return 'MISSED';
  return 'ENDED';
}
