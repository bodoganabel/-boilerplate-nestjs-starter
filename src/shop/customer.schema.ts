import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Quotation } from './quotation.schema';

export type CustomerDocument = Customer & Document;

@Schema()
export class Customer {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  residence: string;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Quotation.name })
  @Type(() => Quotation)
  quotations: Quotation[];
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
