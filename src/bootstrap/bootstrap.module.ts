import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { JwtRefreshToken, JwtRefreshTokenSchema } from 'src/auth/jwt.schema';
import { Permission, PermissionSchema } from 'src/auth/permission.schema';
import { User, UserSchema } from 'src/auth/user.schema';
import { Cill, CillSchema } from 'src/product/cill.schema';
import { Product, ProductSchema } from 'src/product/product.schema';
import { Shutter, ShutterSchema } from 'src/product/shutter.schema';
import { Vent, VentSchema } from 'src/product/vent.schema';
import { Wage, WageSchema } from 'src/product/wage.schema';
import { Customer, CustomerSchema } from 'src/shop/customer.schema';
import { Quotation, QuotationSchema } from 'src/shop/quotation.schema';
import { BootstrapService } from './bootstrap.service';

export const mongooseSchemas = [
  { name: User.name, schema: UserSchema },
  { name: JwtRefreshToken.name, schema: JwtRefreshTokenSchema },
  { name: Permission.name, schema: PermissionSchema },
  { name: Product.name, schema: ProductSchema },
  { name: Shutter.name, schema: ShutterSchema },
  { name: Cill.name, schema: CillSchema },
  { name: Vent.name, schema: VentSchema },
  { name: Wage.name, schema: WageSchema },
  { name: Customer.name, schema: CustomerSchema },
  { name: Quotation.name, schema: QuotationSchema },
];

@Module({
  imports: [AuthModule, MongooseModule.forFeature([...mongooseSchemas])],
  providers: [BootstrapService],
  exports: [BootstrapService],
})
export class BootstrapModule {}
