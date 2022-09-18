import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JobsModule } from './jobs/jobs.module';
import { BootstrapModule } from './bootstrap/bootstrap.module';
import { AttachUserToRequestMiddleware } from './middlewares/attach-user-to-request.middleware';
import { getMongodbConnectionString } from './config';
import { ProductModule } from './product/product.module';
import { ShopModule } from './shop/shop.module';
import { SandboxModule } from './sandbox/sandbox.module';
import { MailModule } from './mail/mail.module';
import { PdfController } from './pdf/pdf.controller';
import { PdfService } from './pdf/pdf.service';
import { PdfModule } from './pdf/pdf.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    MongooseModule.forRoot(getMongodbConnectionString(), {
      dbName: process.env.MONGODB_DATABASE_NAME,
    }),
    AuthModule,
    JobsModule,
    BootstrapModule,
    ProductModule,
    ShopModule,
    SandboxModule,
    MailModule,
    PdfModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'pdf/templates'),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    AdminModule,
  ],
  controllers: [PdfController],
  providers: [PdfService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AttachUserToRequestMiddleware).forRoutes('*');
  }
}
