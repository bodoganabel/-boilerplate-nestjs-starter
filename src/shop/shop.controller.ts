import { Body, Controller, Post } from '@nestjs/common';
import { QuotationDto } from './dto/quotation.dto';
import { ShopService } from './shop.service';

@Controller('shop')
export class ShopController {
  constructor(private shopService: ShopService) {}

  @Post('/quotation')
  async setProduct(@Body() quotationDto: QuotationDto) {
    console.log('called with:');
    console.log(JSON.stringify(quotationDto));
    return await this.shopService.quotation(
      quotationDto.quotationCustomer,
      quotationDto.quotationSummary,
    );
  }
}
