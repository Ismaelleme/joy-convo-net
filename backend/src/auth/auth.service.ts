import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const validPassword = await compare(dto.password, user.passwordHash);

    if (!validPassword) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      session: {
        message: 'Login realizado com sucesso.',
      },
    };
  }
}
