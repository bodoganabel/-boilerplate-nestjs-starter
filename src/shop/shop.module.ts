import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseSchemas } from 'src/bootstrap/bootstrap.module';
import { PdfService } from 'src/pdf/pdf.service';
import { MailService } from 'src/mail/mail.service';
import { PdfModule } from 'src/pdf/pdf.module';
import { MailModule } from 'src/mail/mail.module';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    MongooseModule.forFeature([...mongooseSchemas]),
    MailModule,
    PdfModule,
    ProductModule,
  ],
  providers: [ShopService, PdfService, MailService, ProductService],
  controllers: [ShopController],
})
export class ShopModule {}
