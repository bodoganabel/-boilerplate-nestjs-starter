import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

export type ShutterDocument = Shutter & Document;

export interface IShutter {
  name: string;
  nmAr: number;
  minFizetendoNm: number;
  maxRendelhetoNm: number;
}

export interface IAluminiumShutter extends IShutter {
  name: string;
  motorAr: number;
  kapcsoloAr: number;
  egycsatornasKapcsoloAr: number;
  egycsatornasTaviranyitoAr: number;
  otpluszegyCsatornasTaviranyitoAr: number;
}

export interface IAluminiumSzunyoghalosShutter extends IShutter {
  name: string;
  motorAr: number;
  egycsatornasKapcsoloAr: number;
  egycsatornasTaviranyitoAr: number;
  otpluszegyCsatornasTaviranyitoAr: number;
}

@Schema()
export class Shutter {
  /*   @Transform(({ value }) => value.toString())
  _id: string; */

  @Prop({ type: mongoose.Schema.Types.Mixed })
  muanyag: IShutter;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  muanyagSzunyoghalos: IShutter;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  aluminium: IAluminiumShutter;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  aluminiumSzunyoghalos: IAluminiumSzunyoghalosShutter;
  @Prop({ type: mongoose.Schema.Types.Mixed })
  mobilSzunyoghalo: IShutter;
}

export const ShutterSchema = SchemaFactory.createForClass(Shutter);
