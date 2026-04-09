import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string) {
    let settings = await this.prisma.userSettings.findUnique({ where: { userId } });

    if (!settings) {
      settings = await this.prisma.userSettings.create({ data: { userId } });
    }

    return settings;
  }

  async updateSettings(userId: string, dto: {
    primaryColor?: string;
    accentColor?: string;
    language?: string;
    notifications?: boolean;
    soundEnabled?: boolean;
    darkMode?: boolean;
    fontSize?: string;
    privacy?: string;
  }) {
    const existing = await this.prisma.userSettings.findUnique({ where: { userId } });

    if (existing) {
      return this.prisma.userSettings.update({ where: { userId }, data: dto });
    }

    return this.prisma.userSettings.create({ data: { userId, ...dto } });
  }
}
