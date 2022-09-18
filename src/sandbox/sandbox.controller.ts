import { Controller, Get, Post } from '@nestjs/common';
import { SandboxService } from './sandbox.service';

@Controller('sandbox')
export class SandboxController {
  constructor(private sandboxService: SandboxService) {}

  @Post('/mail')
  async sendMail() {
    await this.sandboxService.sendMail();
    return { message: 'Email sent.' };
  }

  @Get('/render-page')
  async renderPage() {
    return await this.sandboxService.renderPage();
  }
}
