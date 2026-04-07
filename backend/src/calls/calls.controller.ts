import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CallsService } from './calls.service';
import { CreateCallDto } from './dto/create-call.dto';
import { EndCallDto } from './dto/end-call.dto';

@Controller('calls')
export class CallsController {
  constructor(private readonly callsService: CallsService) {}

  @Post()
  create(@Body() dto: CreateCallDto) {
    return this.callsService.createCall(dto);
  }

  @Get('user/:userId')
  listByUser(@Param('userId') userId: string) {
    return this.callsService.listByUser(userId);
  }

  @Patch(':callId/answer')
  answer(@Param('callId') callId: string) {
    return this.callsService.answerCall(callId);
  }

  @Patch(':callId/end')
  end(@Param('callId') callId: string, @Body() dto: EndCallDto) {
    return this.callsService.endCall(callId, dto);
  }
}
