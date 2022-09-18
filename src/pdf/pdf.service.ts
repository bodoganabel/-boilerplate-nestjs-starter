/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { appConfig } from 'src/config';
import { IMailAttachment_file, MailService } from 'src/mail/mail.service';
const ejs = require('ejs');
const path = require('path');
const puppeteer = require('puppeteer');

@Injectable()
export class PdfService {
  constructor(private mailService: MailService) {}
  private PATH_TO_PDF_TEMPLATES = path.join(__dirname, './templates');
  private PATH_TO_PDF_OUTPUT = path.join(__dirname, './generated');

  async renderPage(templateName: string, templateParametersJsonString: string) {
    console.log('templateParametersJsonString:');
    console.log(templateParametersJsonString);

    const parsedTemplateParameters = JSON.parse(templateParametersJsonString);

    const html = await ejs.renderFile(
      path.join(this.PATH_TO_PDF_TEMPLATES, templateName),
      parsedTemplateParameters,
      { async: true },
    );
    return html;
  }

  /* @returns the created filepath */
  async generatePdf(
    templateName: string,
    templateParameters: any,
    filename = 'generated.pdf',
    filepathOutput = this.PATH_TO_PDF_OUTPUT,
  ): Promise<string> {
    try {
      const createdFilePath = path.join(
        filepathOutput !== undefined ? filepathOutput : this.PATH_TO_PDF_OUTPUT,
        filename,
      );

      // launch a new chrome instance
      const browser = await puppeteer.launch({
        headless: true,
      });

      // create a new page
      const page = await browser.newPage();

      // set your html as the pages content
      // const htmlContent = readFileSync(`${__dirname}/template.html`, 'utf8');
      await page.setViewport({ width: 1400, height: 768 });
      await page.goto(
        `http://localhost:${
          appConfig.PORT
        }/pdf/render-template?templateName=${encodeURI(
          templateName,
        )}&templateParameters=${encodeURI(JSON.stringify(templateParameters))}`,
        {
          waitUntil: 'domcontentloaded',
        },
      );

      // .pdf file
      await page.emulateMediaType('screen');
      const getHeaderFooter = () => {
        return `<html>
                  <style>html {-webkit-print-color-adjust: exact;} </style>
                  <span style="margin: -5em 0 0 0; height: 3mm; z-index: 1000;  width: 100%;"/>
               </html>`;
      };
      await page.pdf({
        format: 'A4',
        path: createdFilePath,
        scale: 1,
        preferCSSPageSize: false,
        margin: {
          top: '40px',
          right: '20px',
          bottom: '40px',
          left: '20px',
        },
        displayHeaderFooter: true,
        headerTemplate: getHeaderFooter(),
        footerTemplate: getHeaderFooter(),
      });

      // close the browser
      await browser.close();
      return createdFilePath;
    } catch (error) {
      console.log('#da9c22');
      console.log(error);
    }
  }

  async generatePdfToMail(
    to,
    subject,
    emailTemplateName,
    emailTemplateParameters,
    pdfTemplateName,
    pdfTemplateParameters,
    attachmentName = 'Attachment.pdf',
  ) {
    try {
      const temporaryFileName = Math.random().toString() + '.pdf';
      const temporaryFilePath = await this.generatePdf(
        pdfTemplateName,
        pdfTemplateParameters,
        temporaryFileName,
      );

      const attachment: IMailAttachment_file = {
        attachmentName: attachmentName,
        filePath: temporaryFilePath,
      };

      await this.mailService.sendMail(
        to,
        subject,
        emailTemplateName,
        emailTemplateParameters,
        [attachment],
      );

      unlinkSync(temporaryFilePath); //remove temporary file
    } catch (error) {
      console.log('#da9c23');
      console.log(error);
    }
  }
}
