import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Schedule')
@Controller('schedule')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getAll(
    @CurrentUser('sub') userId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.scheduleService.getEvents(userId, startDate, endDate);
  }

  @Get(':id')
  getOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.scheduleService.getEvent(id, userId);
  }

  @Post()
  create(@CurrentUser('sub') userId: string, @Body() dto: any) {
    return this.scheduleService.createEvent(userId, dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser('sub') userId: string, @Body() dto: any) {
    return this.scheduleService.updateEvent(id, userId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser('sub') userId: string) {
    return this.scheduleService.deleteEvent(id, userId);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('sub') userId: string,
    @Body('status') status: any,
  ) {
    return this.scheduleService.updateStatus(id, userId, status);
  }
}
