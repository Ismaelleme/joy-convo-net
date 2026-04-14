import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { ContactsModule } from './contacts/contacts.module';
import { CallsModule } from './calls/calls.module';
import { FeedModule } from './feed/feed.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CommunitiesModule } from './communities/communities.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { AiModule } from './ai/ai.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ChatModule,
    ContactsModule,
    CallsModule,
    FeedModule,
    ScheduleModule,
    CommunitiesModule,
    MarketplaceModule,
    AiModule,
    NotificationsModule,
    SettingsModule,
  ],
})
export class AppModule {}
