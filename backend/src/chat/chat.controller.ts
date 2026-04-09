import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMyChats(@CurrentUser('sub') userId: string) {
    return this.chatService.getUserChats(userId);
  }

  @Post('direct')
  createDirect(@CurrentUser('sub') userId: string, @Body('targetUserId') targetUserId: string) {
    return this.chatService.createDirectChat(userId, targetUserId);
  }

  @Post('group')
  createGroup(
    @CurrentUser('sub') userId: string,
    @Body() dto: { name: string; memberIds: string[] },
  ) {
    return this.chatService.createGroupChat(userId, dto.name, dto.memberIds);
  }

  @Get(':chatId/messages')
  getMessages(
    @Param('chatId') chatId: string,
    @CurrentUser('sub') userId: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.chatService.getChatMessages(chatId, userId, cursor);
  }

  @Post(':chatId/messages')
  sendMessage(
    @Param('chatId') chatId: string,
    @CurrentUser('sub') userId: string,
    @Body() dto: { content: string; type?: string; replyToId?: string },
  ) {
    return this.chatService.sendMessage(chatId, userId, dto.content, dto.type, dto.replyToId);
  }

  @Post(':chatId/read')
  markAsRead(@Param('chatId') chatId: string, @CurrentUser('sub') userId: string) {
    return this.chatService.markAsRead(chatId, userId);
  }
}
