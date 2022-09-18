import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';
import { appConfig } from './config';

function showAppStage() {
  console.log(
    process.env.STAGE === 'production'
      ? '🍏 STAGE:PRODUCTION 🍏'
      : '🧱 STAGE:DEVELOPMENT 🧱',
  );
}

async function bootstrap() {
  console.log(`Setting up app at port: ${appConfig.PORT} ...`);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  await app.listen(appConfig.PORT);
}

async function main() {
  await bootstrap();
  showAppStage();
}

main();
