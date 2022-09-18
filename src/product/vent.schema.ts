import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VentDocument = Vent & Document;

@Schema()
export class Vent {
  @Prop({ type: Number })
  akusztikus: number;
  @Prop({ type: Number })
  zarhato: number;
  @Prop({ type: Number })
  automata: number;
  @Prop({ type: Number })
  gaz: number;
}

export const VentSchema = SchemaFactory.createForClass(Vent);
