import { IsOptional } from 'class-validator';

export class UpdateVentDto {
  @IsOptional()
  akusztikus: number;
  @IsOptional()
  zarhato: number;
  @IsOptional()
  automata: number;
  @IsOptional()
  gaz: number;
}
