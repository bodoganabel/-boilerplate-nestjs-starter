import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { EPermissions } from 'src/auth/permission.schema';
import { PermissionGuard } from 'src/auth/permissions-required.guard';
import { ProductDto } from './dto/product.dto';
import { UpdateCillDto } from './dto/update-cill.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateShutterDto } from './dto/update-shutter.dto';
import { UpdateVentDto } from './dto/update-vent.dto';
import { UpdateWageDto } from './dto/update-wage.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get('/')
  async products(@Query() productDto: ProductDto) {
    return this.productService.getProducts(productDto.id);
  }

  @Post('/')
  async setProduct(@Body() updateProductDto: UpdateProductDto) {
    console.log('setProduct called with:');
    console.log(JSON.stringify(updateProductDto));
    return this.productService.updateProduct(
      updateProductDto.id,
      updateProductDto.priceMatrix,
    );
  }

  @Get('/shutter')
  async shutters() {
    return this.productService.getShutters();
  }

  @UseGuards(new PermissionGuard([EPermissions.UPDATE_PRICES]))
  @Post('/shutter')
  async setShutters(@Body() updateShutterDto: UpdateShutterDto) {
    console.log('updateShutterDto');
    console.log(updateShutterDto);
    return this.productService.updateShutters(
      updateShutterDto.muanyag,
      updateShutterDto.muanyagSzunyoghalos,
      updateShutterDto.aluminium,
      updateShutterDto.aluminiumSzunyoghalos,
      updateShutterDto.mobilSzunyoghalo,
    );
  }
  @Get('/cill')
  async cill() {
    return this.productService.getCill();
  }

  @UseGuards(new PermissionGuard([EPermissions.UPDATE_PRICES]))
  @Post('/cill')
  async setCill(@Body() updateCillDto: UpdateCillDto) {
    console.log('updateCillDto');
    console.log(updateCillDto);
    return this.productService.updateCill(
      updateCillDto.pvc,
      updateCillDto.aluminium,
      updateCillDto.fa,
    );
  }
  @Get('/vent')
  async vent() {
    return this.productService.getVent();
  }

  @UseGuards(new PermissionGuard([EPermissions.UPDATE_PRICES]))
  @Post('/vent')
  async setVent(@Body() updateVentDto: UpdateVentDto) {
    console.log('updateVentDto');
    console.log(updateVentDto);
    return this.productService.updateVent(
      updateVentDto.akusztikus,
      updateVentDto.zarhato,
      updateVentDto.automata,
      updateVentDto.gaz,
    );
  }
  @Get('/wage')
  async wage() {
    return this.productService.getWage();
  }

  @UseGuards(new PermissionGuard([EPermissions.UPDATE_PRICES]))
  @Post('/wage')
  async setWage(@Body() updateWageDto: UpdateWageDto) {
    console.log('updateWageDto');
    console.log(updateWageDto);
    return this.productService.updateWage(
      updateWageDto.szallitas,
      updateWageDto.ujAblak,
      updateWageDto.bontasBeepites,
      updateWageDto.faBeepites,
      updateWageDto.kiszallas,
    );
  }

  /* Returns options for the frontend/quotationPage,
   so the FE can populate dropdowns, sliders, etc... */
  @Get('/quotation-options')
  async quotationOptions() {
    return await this.productService.getQuotationOptions();
  }
}
