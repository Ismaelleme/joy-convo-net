import { IsEmail, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'João Silva' })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @Matches(/^\+\d{8,15}$/, { message: 'Telefone deve estar em E.164.' })
  phone!: string;

  @ApiProperty({ description: 'Token retornado por /auth/verify-code' })
  @IsString()
  verificationToken!: string;
}
