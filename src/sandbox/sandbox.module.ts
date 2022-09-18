import { Module } from '@nestjs/common';
import { SandboxService } from './sandbox.service';
import { SandboxController } from './sandbox.controller';
/* This module is for testing functionality before implementing them */

@Module({
  providers: [SandboxService],
  controllers: [SandboxController],
})
export class SandboxModule {}
