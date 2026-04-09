import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Feed')
@Controller('feed')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  getFeed(@CurrentUser('sub') userId: string, @Query('cursor') cursor?: string) {
    return this.feedService.getFeed(userId, cursor);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: { content: string; imageUrl?: string }) {
    return this.feedService.createPost(userId, dto.content, dto.imageUrl);
  }

  @Delete(':postId')
  delete(@Param('postId') postId: string, @CurrentUser('sub') userId: string) {
    return this.feedService.deletePost(postId, userId);
  }

  @Post(':postId/like')
  toggleLike(@Param('postId') postId: string, @CurrentUser('sub') userId: string) {
    return this.feedService.toggleLike(postId, userId);
  }

  @Get(':postId/comments')
  getComments(@Param('postId') postId: string) {
    return this.feedService.getComments(postId);
  }

  @Post(':postId/comments')
  addComment(
    @Param('postId') postId: string,
    @CurrentUser('sub') userId: string,
    @Body('content') content: string,
  ) {
    return this.feedService.addComment(postId, userId, content);
  }
}
