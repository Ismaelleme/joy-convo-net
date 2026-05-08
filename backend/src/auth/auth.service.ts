import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { VerificationService } from './verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly verification: VerificationService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Token de verificação válido para esse telefone?
    this.verification.assertVerifiedToken(dto.verificationToken, dto.phone);

    const email = dto.email.toLowerCase();

    // 2. Email/telefone únicos?
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { phone: dto.phone }] },
      select: { id: true, email: true, phone: true },
    });
    if (existing) {
      const reason = existing.email === email ? 'E-mail' : 'Telefone';
      throw new ConflictException(`${reason} já cadastrado.`);
    }

    // 3. Cria usuário com phoneVerified=true
    const passwordHash = await hash(dto.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name,
        passwordHash,
        phone: dto.phone,
        phoneVerified: true,
      },
      select: {
        id: true, email: true, name: true, avatar: true, phone: true, phoneVerified: true,
      },
    });

    const token = this.generateToken(user.id, user.email);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) throw new UnauthorizedException('Credenciais inválidas.');

    const valid = await compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Credenciais inválidas.');

    if (!user.phoneVerified) {
      throw new UnauthorizedException('Telefone não verificado. Conclua o cadastro.');
    }

    const token = this.generateToken(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        phoneVerified: user.phoneVerified,
      },
      token,
    };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, avatar: true, bio: true,
        phone: true, phoneVerified: true, status: true,
      },
    });
  }

  private generateToken(userId: string, email: string): string {
    return this.jwtService.sign({ sub: userId, email });
  }
}
