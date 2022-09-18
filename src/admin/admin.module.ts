import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { BootstrapModule } from 'src/bootstrap/bootstrap.module';

@Module({
  imports: [BootstrapModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
