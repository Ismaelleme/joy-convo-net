import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { CallsModule } from './calls/calls.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, CallsModule],
})
export class AppModule {}
