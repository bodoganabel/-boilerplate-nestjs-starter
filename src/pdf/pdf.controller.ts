import { Controller, Get, Post, Query } from '@nestjs/common';
import { RenderTemplateDto } from './dto/renderTemplate.dto';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private pdfService: PdfService) {}

  @Get('/render-template')
  async renderTemplate(@Query() renderTemplateDto: RenderTemplateDto) {
    return await this.pdfService.renderPage(
      renderTemplateDto.templateName,
      renderTemplateDto.templateParameters,
    );
  }

  @Post('/quote')
  async quote() {
    const to = 'bodoganabel@gmail.com';
    const subject = `Árajánlat ${'Bodogán Ábel'} részére`;
    const emailTemplateName = 'quote-mail.ejs';
    const emailTemplateParameters = {
      name: 'Bodogán Ábel',
    };
    const pdfTemplateName = 'quote-template/index.ejs';
    const pdfTemplateParameters = {
      name: 'Bodogán Ábel',
      email: 'bodoganabel@gmail.com',
      date: new Date().toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      quoteId: 123412343256161616,
      residence: false
        ? 'Dorog, Bécsi út 33, 2510 Magyarország'
        : 'Nem adta meg',
      phone: true ? '+36304249989' : 'Nem adta meg',

      pr_profile: 'Deceuninck Inoutic Arcade, 5 légkamrás', //product profile
      pr_color: 'Fehér', //product profile
      pr_glass: '4-16-4 low-e + Ag U=1,0', //product profile
      pr_iron: 'Maco Multi-Matic', //product profile
      products: [
        {
          name: 'Egyszárnyú bejárati ajtó',
          width: '200 cm',
          length: '60 cm',
          quantity: '1 db',
          netPrice: '147 826 Ft',
          grossPrice: '187 739 Ft',
          grossValue: '187 739 Ft',
        },
        {
          name: 'Kétszárnyú bejárati ajtó',
          width: '250 cm',
          height: '40 cm',
          quantity: '2 db',
          netPrice: '247 826 Ft',
          grossPrice: '287 739 Ft',
          grossValue: '587 739 Ft',
        },
      ],
      productsTotal: '240 902 Ft',
      productsDeposit: '120 451 Ft',

      service_delivery: '187 739 Ft',
      service_build: '187 739 Ft',
      service_shutters: '187 739 Ft',
      service_webs: '187 739 Ft',
      service_cills: '187 739 Ft',
      serviceTotal: '187 739 Ft',
    };
    const attachmentName = 'Arajanlat_2022_05_05.pdf';

    await this.pdfService.generatePdfToMail(
      to,
      subject,
      emailTemplateName,
      emailTemplateParameters,
      pdfTemplateName,
      pdfTemplateParameters,
      attachmentName,
    );
    return { message: 'Pdf generated to file.' };
  }

  @Post('/testpdf-tofile')
  async testPdfToFile() {
    const students = [
      {
        name: 'Joy',
        email: 'joy@example.com',
        city: 'New York',
        country: 'USA',
      },
      {
        name: 'John',
        email: 'John@example.com',
        city: 'San Francisco',
        country: 'USA',
      },
    ];

    const templateName = 'template.ejs',
      templateParameters = { students: students };

    await this.pdfService.generatePdf(templateName, templateParameters);
    return { message: 'Pdf generated to file.' };
  }

  @Post('/testpdf-toMail')
  async testPdfToMail() {
    const students = [
      {
        name: 'Joy',
        email: 'joy@example.com',
        city: 'New York',
        country: 'USA',
      },
      {
        name: 'John',
        email: 'John@example.com',
        city: 'San Francisco',
        country: 'USA',
      },
    ];

    const emailTemplateName = 'test.ejs',
      emailTemplateParameters = { students: ['Abel', 'Anna', 'Matyi', 'Peti'] },
      to = 'bodoganabel@gmail.com',
      subject = 'Welcome to Nice App! Confirm your Email',
      pdfTemplateName = 'template.ejs',
      pdfTemplateParameters = { students: students },
      attachmentName = 'test.pdf';

    await this.pdfService.generatePdfToMail(
      to,
      subject,
      emailTemplateName,
      emailTemplateParameters,
      pdfTemplateName,
      pdfTemplateParameters,
      attachmentName,
    );
    return { message: 'Pdf generated to file.' };
  }

  @Post('/testpdf-tofile2')
  async testPdfToFile2() {
    const templateName = '/quote-template/index.ejs',
      templateParameters = {
        name: 'bodoganabel',
        email: 'bodoganabel@gmail.com',
      };

    await this.pdfService.generatePdf(templateName, templateParameters);
    return { message: 'Pdf generated to file.' };
  }
}
