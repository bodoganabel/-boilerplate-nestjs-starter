/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { createReadStream } from 'fs';
import { SendMailOptions } from 'nodemailer';
import { Readable } from 'stream';
const path = require('path');
const nodemailer = require('nodemailer');
const ejs = require('ejs');

export interface IMailAttachment_file {
  attachmentName: string;
  filePath: string;
}
export interface IMailAttachment_buffer {
  attachmentName: string;
  stream: Readable /* ReadStream */;
}

@Injectable()
export class MailService {
  private PATH_TO_TEMPLATES = path.join(__dirname, './templates');

  transporterOptions = {
    host: process.env.MAIL_HOST,
    secure: process.env.MAIL_SECURE === 'true' ? true : false,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  transporter = nodemailer.createTransport(this.transporterOptions);

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    templateParameters?: any,
    attachmentsFromFiles?: IMailAttachment_file[],
    from?: string,
  ) {
    try {
      const htmlMessage = await ejs.renderFile(
        path.join(this.PATH_TO_TEMPLATES, templateName),
        templateParameters,
        { async: true },
      );

      const attachments = [];
      if (attachmentsFromFiles !== undefined) {
        attachmentsFromFiles.forEach((attachment: IMailAttachment_file) => {
          attachments.push({
            filename: attachment.attachmentName,
            content: createReadStream(attachment.filePath),
          });
        });
      }

      const message: SendMailOptions = {
        from: from === undefined ? process.env.MAIL_FROM : from,
        to: to,
        subject: subject,
        text: htmlMessage,
        html: htmlMessage,
        attachments: attachments,
      };
      await this.transporter.sendMail(message);
    } catch (error) {
      console.log('#194fbb');
      console.log(error);
    }
  }
}
