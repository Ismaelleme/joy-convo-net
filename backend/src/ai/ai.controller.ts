import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('AI Assistant')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('conversations')
  list(@CurrentUser('sub') userId: string) {
    return this.aiService.getConversations(userId);
  }

  @Get('conversations/:id')
  get(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.aiService.getConversation(id, userId);
  }

  @Post('conversations')
  create(@CurrentUser('sub') userId: string, @Body('title') title?: string) {
    return this.aiService.createConversation(userId, title);
  }

  @Post('conversations/:id/messages')
  sendMessage(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body('content') content: string,
  ) {
    return this.aiService.sendMessage(id, userId, content);
  }

  @Delete('conversations/:id')
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.aiService.deleteConversation(id, userId);
  }
}
