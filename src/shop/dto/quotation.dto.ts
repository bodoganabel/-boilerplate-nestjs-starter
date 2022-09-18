import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EActualityOptions,
  ECillOptions,
  EDeliveryBuildOptions,
  EHeardFromUsOptions,
  EPriorityOptions,
  EProductTypeOptions,
  EShutterOptions,
  EWebOptions,
} from '../quotation.schema';

export class IQuotationCustomer {
  @IsString()
  customerDetails_name: string;

  @IsEmail()
  customerDetails_email: string;

  @IsOptional()
  @IsString()
  customerDetails_residence: string;

  @IsOptional()
  @IsString()
  customerDetails_phone: string;
}

export class IQuotationProduct {
  @IsEnum(EProductTypeOptions)
  productType: EProductTypeOptions;
  @IsInt()
  width: number;
  @IsInt()
  height: number;
  @IsEnum(EShutterOptions)
  shutter: EShutterOptions;
  @IsEnum(EWebOptions)
  web: EWebOptions;
  @IsEnum(ECillOptions)
  cill: ECillOptions;
  @IsInt()
  count: ECillOptions;
}

export class IQuotationSummary {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => IQuotationProduct)
  quotationProducts: IQuotationProduct[];

  @IsString()
  family: string;

  @IsBoolean()
  quotationDetails_callMeBack: boolean;

  @IsEnum(EDeliveryBuildOptions)
  quotationDetails_deliveryBuildin: EDeliveryBuildOptions;

  @IsEnum(EActualityOptions)
  quotationDetails_actuality: EActualityOptions;

  @IsOptional()
  @IsString()
  quotationDetails_notes: string;

  @IsEnum(EPriorityOptions)
  quotationDetails_priority: EPriorityOptions;

  @IsEnum(EHeardFromUsOptions)
  quotationDetails_heardFromUs: string;
}

export class QuotationDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IQuotationCustomer)
  quotationCustomer: IQuotationCustomer;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => IQuotationSummary)
  quotationSummary: IQuotationSummary;
}
