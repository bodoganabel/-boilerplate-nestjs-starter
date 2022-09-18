/* eslint-disable @typescript-eslint/no-var-requires */
import { join } from 'path';
const ejs = require('ejs');
const path = require('path');
const nodemailer = require('nodemailer');
import { SendMailOptions } from 'nodemailer';

import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';

@Injectable()
export class SandboxService {
  async sendMail() {
    const PATH_TO_TEMPLATES = join(__dirname, '../templates/mail');

    console.log('mail templates:');
    console.log(join(PATH_TO_TEMPLATES, './confirmation'));

    const transporter = nodemailer.createTransport({
      host: 'mail.abell.hu',
      secure: true,
      port: 465,
      auth: {
        user: 'sandbox@abell.hu',
        pass: 'sandboxPass12345_',
      },
    });

    const htmlMessage = await ejs.renderFile(
      path.join(PATH_TO_TEMPLATES, 'test.ejs'),
      { students: ['Abel', 'Anna', 'Matyi', 'Peti'] },
      { async: true },
    );

    const attachmentPath = join(__dirname, '../generated/report.pdf');

    const message: SendMailOptions = {
      from: '"Abell" <sandbox@abell.hu>',
      to: 'bodoganabel@gmail.com' /* 'ezra.kling23@ethereal.email' */,
      subject: 'Welcome to Nice App! Confirm your Email',
      text: htmlMessage,
      html: htmlMessage,
      attachments: [
        {
          filename: attachmentPath,
          content: createReadStream(attachmentPath),
        },
      ],
    };

    const result = await transporter.sendMail(message);
    console.log('result:');
    console.log(result);
  }

  async renderPage() {
    const PATH_TO_PDF_TEMPLATES = path.join(__dirname, '../pdf/templates');
    const html = await ejs.renderFile(
      path.join(PATH_TO_PDF_TEMPLATES, '/quote-template/index.ejs'),
      { name: 'Bodogan Abel' },
      { async: true },
    );
    return html;
  }
}
