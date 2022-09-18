import { IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsOptional()
  @IsString()
  id: string;
}
