import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Contacts')
@Controller('contacts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getAll(@CurrentUser('sub') userId: string) {
    return this.contactsService.getContacts(userId);
  }

  @Get('favorites')
  getFavorites(@CurrentUser('sub') userId: string) {
    return this.contactsService.getFavorites(userId);
  }

  @Post()
  add(@CurrentUser('sub') userId: string, @Body() dto: { contactId: string; nickname?: string }) {
    return this.contactsService.addContact(userId, dto.contactId, dto.nickname);
  }

  @Patch(':contactId/favorite')
  toggleFavorite(@CurrentUser('sub') userId: string, @Param('contactId') contactId: string) {
    return this.contactsService.toggleFavorite(userId, contactId);
  }

  @Patch(':contactId/block')
  block(@CurrentUser('sub') userId: string, @Param('contactId') contactId: string) {
    return this.contactsService.blockContact(userId, contactId);
  }

  @Delete(':contactId')
  remove(@CurrentUser('sub') userId: string, @Param('contactId') contactId: string) {
    return this.contactsService.removeContact(userId, contactId);
  }
}
