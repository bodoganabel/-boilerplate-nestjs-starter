/* eslint-disable @typescript-eslint/no-var-requires */
import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
const path = require('path');

@Controller('mail')
export class MailController {
  constructor(private mailService: MailService) {}

  @Post('/testmail')
  async testMail() {
    const attachmentPath = path.join(__dirname, '../pdf/generated/example.pdf');
    console.log('attachmentPath:');
    console.log(attachmentPath);
    const to = 'bodoganabel@gmail.com',
      subject = 'Welcome to Nice App! Confirm your Email',
      templateName = 'test.ejs',
      templateParameters = { students: ['Abel', 'Anna', 'Matyi', 'Peti'] },
      attachments = [
        {
          attachmentName: 'Test.pdf',
          filePath: attachmentPath,
        },
      ];
    await this.mailService.sendMail(
      to,
      subject,
      templateName,
      templateParameters,
      attachments,
    );
    return { message: 'Email sent.' };
  }
}
