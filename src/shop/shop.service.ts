import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EConstants } from 'src/config';
import { PdfService } from 'src/pdf/pdf.service';
import { Cill, CillDocument } from 'src/product/cill.schema';
import { Product, ProductDocument } from 'src/product/product.schema';
import { ProductService } from 'src/product/product.service';
import { Shutter, ShutterDocument } from 'src/product/shutter.schema';
import { Vent, VentDocument } from 'src/product/vent.schema';
import { Wage, WageDocument } from 'src/product/wage.schema';
import { Customer, CustomerDocument } from './customer.schema';
import { IQuotationCustomer, IQuotationSummary } from './dto/quotation.dto';
import {
  injectPricesToQuotationProducts,
  IPriceInjectedProduct,
} from './helpers/product-prices';
import { validateQuotation } from './helpers/quotation-validation';
import { getServicePrices, IServicePrices } from './helpers/service-prices';
import { Quotation, QuotationDocument } from './quotation.schema';

@Injectable()
export class ShopService {
  constructor(
    private pdfService: PdfService,
    private productService: ProductService,
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
    @InjectModel(Shutter.name)
    private shutterModel: Model<ShutterDocument>,
    @InjectModel(Cill.name)
    private cillModel: Model<CillDocument>,
    @InjectModel(Vent.name)
    private ventModel: Model<VentDocument>,
    @InjectModel(Quotation.name)
    private quotationModel: Model<QuotationDocument>,
    @InjectModel(Wage.name)
    private wageModel: Model<WageDocument>,
    @InjectModel(Customer.name)
    private customerModel: Model<CustomerDocument>,
  ) {}

  async quotation(
    quotationCustomer: IQuotationCustomer,
    quotationSummary: IQuotationSummary,
  ): Promise<{ message: string }> {
    const targetedProducts = await this.productService.getProductsByQuotation(
      quotationSummary.quotationProducts,
      quotationSummary.family,
    );
    console.log('targetProducts:');
    console.log(targetedProducts);

    const cills: Cill = await this.cillModel.findOne({});
    const shutters: Shutter = await this.shutterModel.findOne({});

    const isQuotationValid = validateQuotation(
      targetedProducts,
      quotationSummary,
    );
    if (!isQuotationValid) {
      throw new BadRequestException('Quotation is not valid []...');
    }

    const customerQuery = { email: quotationCustomer.customerDetails_email };
    let customer: any = await this.customerModel.findOne(customerQuery);
    console.log('customer:');
    console.log(customer);
    if (customer === null) {
      customer = await this.customerModel.create({
        name: quotationCustomer.customerDetails_name,
        email: quotationCustomer.customerDetails_email,
        phone: quotationCustomer.customerDetails_phone,
        residence: quotationCustomer.customerDetails_residence,
        quotations: [],
      });
      console.log('new customer:');
      console.log(customer);
    }
    const newQuotation = await this.quotationModel.create({
      ...quotationSummary,
      customer: customer._id,
    });
    await this.customerModel.updateOne(
      { customer },
      {
        $push: {
          quotations: {
            $each: [newQuotation._id],
          },
        },
      },
    );

    //Adding prices to quotation products
    const priceInjectedProducts: IPriceInjectedProduct[] =
      injectPricesToQuotationProducts(
        quotationSummary,
        targetedProducts,
        cills,
        shutters,
      );

    const netTotal = priceInjectedProducts.reduce(
      (total, product) => total + parseInt(product.count) * product.price,
      0,
    );

    const wages: Wage = await this.wageModel.findOne({});
    console.log('wages:');
    console.log(wages);

    const servicePrices: IServicePrices = getServicePrices(
      wages,
      quotationSummary,
      priceInjectedProducts,
    );

    const productList = [];
    priceInjectedProducts.forEach((product: IPriceInjectedProduct) => {
      const nyilaszaro = {
        name: product.name,
        width: product.width,
        height: product.height,
        quantity: product.count,
        netPrice: `${Math.round(product.price)} Ft`,
        grossPrice: `${Math.round(product.price * EConstants.VAT_HU)} Ft`,
        grossValue: `${Math.round(
          product.price * EConstants.VAT_HU * parseInt(product.count),
        )} Ft`,
      };

      productList.push(nyilaszaro);
    });

    const pdfTemplateParameters = {
      name: quotationCustomer.customerDetails_name,
      email: quotationCustomer.customerDetails_email,
      date: new Date().toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      quoteId: newQuotation._id,
      residence:
        quotationCustomer.customerDetails_residence !== ''
          ? quotationCustomer.customerDetails_residence
          : 'Nem adta meg',
      phone:
        quotationCustomer.customerDetails_phone !== ''
          ? quotationCustomer.customerDetails_phone
          : 'Nem adta meg',

      pr_profile: `Deceuninck ${quotationSummary.family}, 5 légkamrás`, //product profile
      pr_color: 'Fehér', //product profile
      pr_glass: '4-16-4 low-e + Ag U=1,0', //product profile
      pr_iron: 'Maco Multi-Matic', //product profile
      products: productList,
      productsTotal: `${Math.round(netTotal * EConstants.VAT_HU)} Ft`,
      productsDeposit: `${Math.round(
        netTotal * EConstants.VAT_HU * EConstants.DEPOSIT_MULTIPLIER,
      )} Ft`,

      service_delivery: `${Math.round(servicePrices.service_delivery)} Ft`,
      service_build: `${Math.round(servicePrices.service_build)} Ft`,
      service_shutters: `${Math.round(servicePrices.service_shutters)} Ft`,
      service_webs: `${Math.round(servicePrices.service_webs)} Ft`,
      service_cills: `${Math.round(servicePrices.service_cills)} Ft`,
      serviceTotal: `${Math.round(
        (Object.values(servicePrices) as number[]).reduce(
          (total, value) => total + value,
          0,
        ),
      )} Ft`,
    };

    await this.pdfService.generatePdfToMail(
      quotationCustomer.customerDetails_email,
      `Árajánlat ${quotationCustomer.customerDetails_name} részére`,
      'quote-mail.ejs',
      { name: quotationCustomer.customerDetails_name },
      'quote-template/index.ejs',
      pdfTemplateParameters,
      `Árajanlat ${new Date().toDateString()}.pdf`,
    );

    console.log('pdfTemplateParameters:');
    console.log(pdfTemplateParameters);
    console.log('newQuotation._id:');
    console.log(newQuotation._id);

    return { message: 'OK' };
  }
}
