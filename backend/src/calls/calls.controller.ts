import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CallsService } from './calls.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Calls')
@Controller('calls')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(
    @CurrentUser('sub') userId: string,
    @Body() dto: { calleeId: string; type: 'VOICE' | 'VIDEO' },
  ) {
    return this.callsService.createCall(userId, dto.calleeId, dto.type);
  }

  @Get()
  list(@CurrentUser('sub') userId: string) {
    return this.callsService.listByUser(userId);
  }

  @Patch(':callId/answer')
  answer(@Param('callId') callId: string) {
    return this.callsService.answerCall(callId);
  }

  @Patch(':callId/end')
  end(@Param('callId') callId: string, @Body('reason') reason?: 'ENDED' | 'MISSED' | 'DECLINED') {
    return this.callsService.endCall(callId, reason);
  }
}
