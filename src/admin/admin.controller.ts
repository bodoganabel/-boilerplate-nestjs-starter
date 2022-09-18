import {
  Controller,
  Get,
  Post,
  Request,
  UnauthorizedException,
} from '@nestjs/common';

import { BootstrapService } from 'src/bootstrap/bootstrap.service';
import { ResetDbDto } from './dto/resetDb.dto';

@Controller('admin')
export class AdminController {
  constructor(private bootstrapService: BootstrapService) {}

  @Get('/healthcheck')
  async healthcheck() {
    return { message: 'Server is up and running' };
  }

  @Post('/resetdb')
  async test(@Request() resetDbDto: ResetDbDto) {
    console.log('resetDbDto:');
    console.log(resetDbDto);
    if (resetDbDto.masterPassword === process.env.MASTER_PASSWORD) {
      console.log('Resetting DB contents to default...');
      this.bootstrapService.initDatabase(true);
    } else {
      throw new UnauthorizedException('This command requires master access');
    }
  }
}
