import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type CillDocument = Cill & Document;

export interface ICill {
  cm10: number;
  cm20: number;
  cm30: number;
  cm40: number;
  cm50: number;
  cm60: number;
}

@Schema()
export class Cill {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  pvc: ICill;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  aluminium: ICill;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  fa: ICill;
}

export const CillSchema = SchemaFactory.createForClass(Cill);
