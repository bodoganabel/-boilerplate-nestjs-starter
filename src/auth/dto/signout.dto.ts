import { IsString } from 'class-validator';

export class SignoutDto {
  @IsString()
  refreshToken: string;
}
