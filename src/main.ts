import { NestFactory } from '@nestjs/core';
import { AppModule } from './common/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Konfigurasi Swagger
  const config = new DocumentBuilder()
    .setTitle('Interoperabilitas CKG - SITB')
    .setDescription('Konsolidator API untuk interoperabilitas CKG - SITB.')
    .setVersion('1.0')
    .addTag('Konsolidator', 'Semua endpoint untuk konsolidasi CKG - SITB')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Aktifkan CORS jika diperlukan
  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/docs`);
}
bootstrap();
