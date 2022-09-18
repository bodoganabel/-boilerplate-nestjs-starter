import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IQuotationProduct } from 'src/shop/dto/quotation.dto';
import { Cill, CillDocument, ICill } from './cill.schema';
import {
  IProductPriceMatrix,
  Product,
  ProductDocument,
} from './product.schema';
import { IQuotationOptionsResponse } from './product.types';
import {
  IAluminiumShutter,
  IAluminiumSzunyoghalosShutter,
  IShutter,
  Shutter,
  ShutterDocument,
} from './shutter.schema';
import { Vent, VentDocument } from './vent.schema';
import { IZone, Wage, WageDocument } from './wage.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Shutter.name)
    private shutterModel: Model<ShutterDocument>,
    @InjectModel(Cill.name)
    private cillModel: Model<CillDocument>,
    @InjectModel(Vent.name)
    private ventModel: Model<VentDocument>,
    @InjectModel(Wage.name)
    private wageModel: Model<WageDocument>,
  ) {}

  async getProducts(id: string | undefined): Promise<any[]> {
    const query = id ? { _id: id } : {};
    const products = await this.productModel.find(query);

    console.log('query');
    console.log(query);

    const convertedProducts = products.map((product) => product.toObject());
    convertedProducts.forEach(
      (product) => (product._id = product._id.valueOf()),
    );
    return convertedProducts;
  }

  async getProductsByQuotation(
    quotationProducts: IQuotationProduct[],
    family: string,
  ): Promise<any[]> {
    const query = {
      family,
      name: { $in: quotationProducts.map((product) => product.productType) },
    };
    const products = await this.productModel.find(query);
    const convertedProducts = products.map((product) => product.toObject());
    convertedProducts.forEach(
      (product) => (product._id = product._id.valueOf()),
    );
    return convertedProducts;
  }

  async updateProduct(
    id: string,
    priceMatrix: IProductPriceMatrix,
  ): Promise<{ message: string }> {
    console.log('priceMatrix');
    console.log(priceMatrix);

    const result = await this.productModel.findOneAndUpdate(
      { _id: id },
      { $set: { priceMatrix: priceMatrix } },
      { returnNewDocument: true },
    );
    console.log('result.matchedCount:');
    console.log(result);
    return {
      message: `matchedCount: ${JSON.stringify(result)}`,
    };
  }

  //Shutterok

  async getShutters(): Promise<any[]> {
    const query = {};
    const shutterok = await this.shutterModel.find(query);

    console.log('query');
    console.log(query);

    const convertedShutters = shutterok.map((shutter) => shutter.toObject());
    convertedShutters.forEach(
      (shutter) => (shutter._id = shutter._id.valueOf()),
    );
    return convertedShutters;
  }

  async updateShutters(
    muanyag?: IShutter,
    muanyagSzunyoghalos?: IShutter,
    aluminium?: IAluminiumShutter,
    aluminiumSzunyoghalos?: IAluminiumSzunyoghalosShutter,
    mobilSzunyoghalo?: IShutter,
  ): Promise<{ message: string }> {
    const result = await this.shutterModel.findOneAndUpdate(
      {},
      {
        $set: {
          muanyag: muanyag ? muanyag : undefined,
          muanyagSzunyoghalos: muanyagSzunyoghalos
            ? muanyagSzunyoghalos
            : undefined,
          aluminium: aluminium ? aluminium : undefined,
          aluminiumSzunyoghalos: aluminiumSzunyoghalos
            ? aluminiumSzunyoghalos
            : undefined,
          mobilSzunyoghalo: mobilSzunyoghalo ? mobilSzunyoghalo : undefined,
        },
      },
      { returnNewDocument: true },
    );
    return {
      message: `matchedCount: ${JSON.stringify(result)}`,
    };
  }

  //Cill - ablakpárkányok

  async getCill(): Promise<any[]> {
    const query = {};
    const cill = await this.cillModel.find(query);

    console.log('query');
    console.log(query);

    const convertedCill = cill.map((shutter) => shutter.toObject());
    convertedCill.forEach((cill) => (cill._id = cill._id.valueOf()));
    return convertedCill;
  }

  async updateCill(
    pvc?: ICill,
    aluminium?: ICill,
    fa?: ICill,
  ): Promise<{ message: string }> {
    const result = await this.cillModel.findOneAndUpdate(
      {},
      {
        $set: {
          pvc: pvc ? pvc : undefined,
          aluminium: aluminium ? aluminium : undefined,
          fa: fa ? fa : undefined,
        },
      },
      { returnNewDocument: true },
    );
    return {
      message: `matchedCount: ${JSON.stringify(result)}`,
    };
  }

  //Vent - szellőzők

  async getVent(): Promise<any[]> {
    const query = {};
    const vent = await this.ventModel.find(query);

    console.log('query');
    console.log(query);

    const convertedVent = vent.map((shutter) => shutter.toObject());
    convertedVent.forEach((vent) => (vent._id = vent._id.valueOf()));
    return convertedVent;
  }

  async updateVent(
    akusztikus?: number,
    zarhato?: number,
    automata?: number,
    gaz?: number,
  ): Promise<{ message: string }> {
    const result = await this.ventModel.findOneAndUpdate(
      {},
      {
        $set: {
          akusztikus: akusztikus ? akusztikus : undefined,
          zarhato: zarhato ? zarhato : undefined,
          automata: automata ? automata : undefined,
          gaz: gaz ? gaz : undefined,
        },
      },
      { returnNewDocument: true },
    );
    return {
      message: `matchedCount: ${JSON.stringify(result)}`,
    };
  }

  //Wage - munkadíjak

  async getWage(): Promise<any[]> {
    const query = {};
    const wageResult = await this.wageModel.find(query);

    console.log('query');
    console.log(query);

    const convertedWage = wageResult.map((wage) => wage.toObject());
    convertedWage.forEach((wage) => (wage._id = wage._id.valueOf()));
    return convertedWage;
  }

  async updateWage(
    szallitas: IZone,
    ujAblak: number,
    bontasBeepites: number,
    faBeepites: number,
    kiszallas: IZone,
  ): Promise<{ message: string }> {
    const result = await this.wageModel.findOneAndUpdate(
      {},
      {
        $set: {
          szallitas: szallitas ? szallitas : undefined,
          ujAblak: ujAblak ? ujAblak : undefined,
          bontasBeepites: bontasBeepites ? bontasBeepites : undefined,
          faBeepites: faBeepites ? faBeepites : undefined,
          kiszallas: kiszallas ? kiszallas : undefined,
        },
      },
      { returnNewDocument: true },
    );
    return {
      message: `matchedCount: ${JSON.stringify(result)}`,
    };
  }

  async getQuotationOptions(): Promise<IQuotationOptionsResponse> {
    const productsDocs = await this.productModel.find();
    const result2 = await this.shutterModel.find();
    const result3 = await this.cillModel.find();
    const result4 = await this.shutterModel.find();

    console.log('productsDocs:');
    console.log(productsDocs);

    console.log('result2:');
    console.log(result2);
    console.log('result3:');
    console.log(result3);
    console.log('result4:');
    console.log(result4);

    return {
      productTypes: [{ value: undefined, label: 'Nem kérek' }],
      shutters: [{ value: undefined, label: 'Nem kérek' }],
      webs: [{ value: undefined, label: 'Nem kérek' }],
      cills: [{ value: undefined, label: 'Nem kérek' }],
    };
  }
}
