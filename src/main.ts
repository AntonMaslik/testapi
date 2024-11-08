import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    const config = new DocumentBuilder()
        .setTitle('Tasks Manager Api')
        .setDescription('Tasks Manager Api')
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
