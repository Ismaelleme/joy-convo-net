import { Body, Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser('sub') userId: string) {
    return this.usersService.findById(userId);
  }

  @Get('search')
  search(@Query('q') query: string, @CurrentUser('sub') userId: string) {
    return this.usersService.searchUsers(query, userId);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Patch('profile')
  updateProfile(
    @CurrentUser('sub') userId: string,
    @Body() dto: { name?: string; bio?: string; avatar?: string; phone?: string },
  ) {
    return this.usersService.updateProfile(userId, dto);
  }

  @Patch('status')
  updateStatus(
    @CurrentUser('sub') userId: string,
    @Body('status') status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY',
  ) {
    return this.usersService.updateStatus(userId, status);
  }
}
