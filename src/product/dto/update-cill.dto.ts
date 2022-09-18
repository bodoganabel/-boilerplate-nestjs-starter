import { IsOptional } from 'class-validator';
import { ICill } from '../cill.schema';

export class UpdateCillDto {
  @IsOptional()
  pvc: ICill;
  @IsOptional()
  aluminium: ICill;
  @IsOptional()
  fa: ICill;
}
