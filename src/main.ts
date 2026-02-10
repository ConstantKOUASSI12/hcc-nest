import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  // Active la validation globale

  app.useGlobalInterceptors(
    new ResponseInterceptor(app.get(Reflector)),
    new ClassSerializerInterceptor(app.get(Reflector))
  );

  app.useGlobalFilters(new HttpExceptionFilter());


  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,            // Supprime les propriétés non définies dans le DTO
    forbidNonWhitelisted: true, // Rejette la requête si des propriétés non définies sont présentes
    transform: true,            // Transforme automatiquement les types
  }));

  const config = new DocumentBuilder()
    .setTitle('HCC API')
    .setDescription('API du Handball Club de Comines')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
