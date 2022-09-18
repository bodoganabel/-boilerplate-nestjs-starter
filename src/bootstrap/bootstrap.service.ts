import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { initDb } from './database/initDb';
import { Model } from 'mongoose';
import { Permission, PermissionDocument } from 'src/auth/permission.schema';
import { Product, ProductDocument } from 'src/product/product.schema';
import { Shutter, ShutterDocument } from 'src/product/shutter.schema';
import { Cill, CillDocument } from 'src/product/cill.schema';
import { Vent, VentDocument } from 'src/product/vent.schema';
import { Wage, WageDocument } from 'src/product/wage.schema';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Permission.name)
    private permissionModel: Model<PermissionDocument>,
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
  private readonly logger = new Logger(BootstrapService.name);

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('InitDb 🍫');
    await this.initDatabase();
  }

  async initDatabase(force?: boolean) {
    initDb(
      this.userModel,
      this.permissionModel,
      this.productModel,
      this.shutterModel,
      this.cillModel,
      this.ventModel,
      this.wageModel,
      force,
    );
  }
}
