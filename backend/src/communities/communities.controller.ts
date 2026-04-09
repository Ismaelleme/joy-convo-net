import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CommunitiesService } from './communities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Communities')
@Controller('communities')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}

  @Get()
  listPublic() {
    return this.communitiesService.listPublic();
  }

  @Get('mine')
  mine(@CurrentUser('sub') userId: string) {
    return this.communitiesService.getUserCommunities(userId);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: { name: string; description?: string; isPublic?: boolean }) {
    return this.communitiesService.create(userId, dto);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.communitiesService.join(id, userId);
  }

  @Post(':id/leave')
  leave(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.communitiesService.leave(id, userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.communitiesService.delete(id, userId);
  }
}
