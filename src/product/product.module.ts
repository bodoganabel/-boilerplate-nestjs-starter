import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { mongooseSchemas } from 'src/bootstrap/bootstrap.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [MongooseModule.forFeature([...mongooseSchemas])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
