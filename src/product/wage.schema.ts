import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type WageDocument = Wage & Document;

export interface IZone {
  zona0: number;
  zona1: number;
  zona2: number;
  zona3: number;
  zona4: number;
  zona5: number;
}

@Schema()
export class Wage {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  szallitas: IZone;
  @Prop({ type: Number })
  ujAblak: number;
  @Prop({ type: Number })
  bontasBeepites: number;
  @Prop({ type: Number })
  faBeepites: number;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  kiszallas: IZone;
}

export const WageSchema = SchemaFactory.createForClass(Wage);
