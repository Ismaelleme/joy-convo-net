import { IsEnum, IsOptional } from 'class-validator';

export enum EndReasonDto {
  ENDED = 'ENDED',
  MISSED = 'MISSED',
  DECLINED = 'DECLINED',
}

export class EndCallDto {
  @IsOptional()
  @IsEnum(EndReasonDto)
  reason?: EndReasonDto;
}
