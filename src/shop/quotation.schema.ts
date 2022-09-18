import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Customer } from './customer.schema';

export enum EProductTypeOptions {
  CSAK_KIEGESZITO = 'Csak redőnyt, párkányt, szúnyoghálót kérek nyílászáró nélkül',
  ABLAK_FIX = 'Fix ablak',
  ABLAK_NYILO = 'Nyíló ablak',
  ABLAK_BUKO = 'Bukó ablak',
  ABLAK_BUKO_NYILO = 'Bukó-nyíló ablak',
  ABLAK_KETSZARNYU_BUKO_NYILO = 'Kétszárnyú, bukó-nyíló + nyíló ablak',
  ABLAK_KETSZARNYU_BUKO_NYILO_TOKOSZTOTT = 'Kétszárnyú, bukó-nyíló + bukó-nyíló, tokosztott ablak',

  ERKEYAJTO_NYILO = 'Nyíló erkélyajtó',
  ERKEYAJTO_BUKO_NYILO = 'Bukó-nyíló erkélyajtó',
  ERKEYAJTO_KETSZARNYU = 'Kétszárnyú, bukó-nyíló + nyíló erkélyajtó',
  ERKEYAJTO_TOLO_BUKO = 'Toló-bukó erkélyajtó',

  AJTO_EGYSZARNYU = 'Egyszárnyú Bejárati Ajtó',
  AJTO_KETSZARNYU = 'Kétszárnyú Bejárati Ajtó',
}

export enum EShutterOptions {
  UNSELECTED = 'Nem kérek',
  SHUTTER_MUANYAG = 'Műanyag',
  SHUTTER_MUANYAG_SZUNYOGHALO = 'Műanyag kombi (szúnyoghálóval)',
  SHUTTER_ALUMINIUM = 'Alumínium',
  SHUTTER_ALUMINIUM_SZUNYOGHALO = 'Alumínium kombi (szúnyoghálóval)',
}
export enum EWebOptions {
  UNSELECTED = 'Nem kérek',
  WEB_FIX_MUANYAG = 'Fix, műanyag keretes',
  WEB_FIX_ALUMINIUM = 'Fix, alumínium keretes',
  WEB_ROLOS = 'Rolós',
  WEB_NYILO_ALUMINIUM_SZUNYOGHALO = 'Nyíló alumínium keretes, erkélyajtóra',
}
export enum ECillOptions {
  UNSELECTED = 'Nem kérek',
  CILL_BELSO_MUANYAG = 'Belső műanyag',
  CILL_KULSO_ALUMINIUM = 'Külső alumínium',
  CILL_BELSO_KULSO_MUANYAG = 'Belső + külső műanyag',
  CILL_BELSO_KULSO_ALUMINIUM = 'Belső + külső alumínium',
}

export enum EDeliveryBuildOptions {
  UNSELECTED = 'Nem kérek',
  SZALLITAS = 'Szállítást kérek',
  BEEPITES = 'Beépítést kérek',
  MINDKETTO = 'Szállítást és Beépítést kérek',
}

export enum EActualityOptions {
  VASAROL = 'Vásárolni szeretnék',
  ERDEKLODIK = 'Csak érdeklődöm',
}
export enum EPriorityOptions {
  MOST = 'Azonnal szükségem van rá',
  HET1 = '1 héten belül szükségem van rá',
  HET2 = '2 héten belül szükségem van rá',
  HET3 = '3 héten belül szükségem van rá',
  HET4 = '4 héten belül szükségem van rá',
  HONAP1 = 'Ráér (több mint 1 hónap múlva van rá szükségem)',
  HONAP2 = 'Ráér (több mint 3 hónap múlva van rá szükségem)',
  HONAP3 = 'Ráér (több mint fél év múlva van rá szükségem)',
}
export enum EHeardFromUsOptions {
  ISMEROS = 'Ismerős javasolta',
  ONLINE_HIRDETES = 'Online hirdetésből',
  GOOGLE = 'Google keresőből',
}

/* QUOTATION STATUS */

export enum EQuotationStatuses {
  EMAIL_KULDES_SIKERTELEN = 'EMAIL_KÜLDÉS_SIKERTELEN',
  OLVASATLAN = 'OLVASATLAN',
  MEGNYITVA = 'MEGNYITVA',
  EMAIL_KULDVE = 'EMAIL_KULDVE',
}

export type QuotationDocument = Quotation & Document;

export class QuotationProduct {
  @Prop({ type: mongoose.Schema.Types.Mixed })
  productType: EProductTypeOptions;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  shutter: EShutterOptions;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  web: EWebOptions;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  cill: ECillOptions;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: Number })
  count: number;
}

@Schema()
export class Quotation {
  @Prop({ type: String })
  family: EProductTypeOptions;

  /* Order subject */
  @Prop({ type: mongoose.Schema.Types.Mixed })
  quotationProducts: QuotationProduct[];

  /* Order details */
  @Prop({ type: Boolean })
  quotationDetails_callMeBack: boolean;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  quotationDetails_deliveryBuildin: EDeliveryBuildOptions;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  quotationDetails_actuality: EActualityOptions;

  @Prop({ type: String })
  quotationDetails_notes: string;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  quotationDetails_priority: EPriorityOptions;

  @Prop({ type: mongoose.Schema.Types.Mixed })
  quotationDetails_heardFromUs: EHeardFromUsOptions;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  customer: Customer;

  @Prop({
    type: mongoose.Schema.Types.Mixed,
    default: EQuotationStatuses.EMAIL_KULDES_SIKERTELEN,
  })
  status: EQuotationStatuses;
}

export const QuotationSchema = SchemaFactory.createForClass(Quotation);
