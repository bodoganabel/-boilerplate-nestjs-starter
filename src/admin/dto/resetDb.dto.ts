import { IsString } from 'class-validator';

export class ResetDbDto {
  @IsString()
  masterPassword: string;
}
