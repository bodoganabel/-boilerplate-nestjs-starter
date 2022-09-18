import { IsOptional } from 'class-validator';
import { IZone } from '../wage.schema';

export class UpdateWageDto {
  @IsOptional()
  szallitas: IZone;
  @IsOptional()
  ujAblak: number;
  @IsOptional()
  bontasBeepites: number;
  @IsOptional()
  faBeepites: number;
  @IsOptional()
  kiszallas: IZone;
}
