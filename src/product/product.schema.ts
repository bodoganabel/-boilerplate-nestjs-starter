import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ProductDocument = Product & Document;

export interface IProductPriceMatrix {
  widths: number[];
  heights: number[];
  prices: number[][];
}

@Schema()
export class Product {
  /*   @Transform(({ value }) => value.toString())
  _id: string; */

  @Prop({ unique: true })
  name: string;

  @Prop({ unique: false })
  family: string;

  @Prop({ unique: false })
  category: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  priceMatrix: IProductPriceMatrix;

  @Prop()
  image: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
