import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum CallTypeDto {
  VOICE = 'VOICE',
  VIDEO = 'VIDEO',
}

export class CreateCallDto {
  @IsString()
  callerId!: string;

  @IsString()
  calleeId!: string;

  @IsEnum(CallTypeDto)
  type!: CallTypeDto;

  @IsOptional()
  @IsString()
  metadata?: string;
}
