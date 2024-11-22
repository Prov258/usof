import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(cookieParser());
    app.enableCors({
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            stopAtFirstError: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('Usof API')
        .setDescription('To be made up')
        .setVersion('1.0')
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addServer(process.env.APP_URL, 'Local development server')
        .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
        })
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, documentFactory);

    await app.listen(3000);
}
bootstrap();
