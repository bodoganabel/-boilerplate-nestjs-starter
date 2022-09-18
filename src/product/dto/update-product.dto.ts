import { IsOptional, IsString } from 'class-validator';
import { IProductPriceMatrix } from '../product.schema';

export class UpdateProductDto {
  @IsString()
  id: string;
  @IsOptional()
  name: string;
  @IsOptional()
  priceMatrix: IProductPriceMatrix;
}
