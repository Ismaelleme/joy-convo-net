import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendCodeDto {
  @ApiProperty({ example: '+5511999999999', description: 'Telefone em formato E.164' })
  @IsString()
  @Matches(/^\+\d{8,15}$/, { message: 'Telefone deve estar em E.164: +<código país><número>' })
  phone!: string;
}

export class VerifyCodeDto {
  @ApiProperty({ example: '+5511999999999' })
  @IsString()
  @Matches(/^\+\d{8,15}$/)
  phone!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Matches(/^\d{4,8}$/, { message: 'Código deve ter de 4 a 8 dígitos.' })
  code!: string;
}
