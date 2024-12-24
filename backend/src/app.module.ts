import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/guards/jwt.guard';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { AdminModule } from './admin/admin.module';
import * as Joi from 'joi';

@Module({
    imports: [
        PrismaModule,
        UserModule,
        ConfigModule.forRoot({
            isGlobal: true,
            validationSchema: Joi.object({
                APP_NAME: Joi.string(),
                APP_URL: Joi.string(),
                DB_CONNECTION: Joi.string(),
                DB_HOST: Joi.string(),
                DB_PORT: Joi.number().port(),
                DB_NAME: Joi.string(),
                DB_USERNAME: Joi.string(),
                DB_PASSWORD: Joi.string(),
                DATABASE_URL: Joi.string(),
                JWT_SECRET: Joi.string(),
                JWT_ACCESS_SECRET: Joi.string().min(8),
                JWT_ACCESS_TIME: Joi.string().default('15m'),
                JWT_REFRESH_SECRET: Joi.string().min(8),
                JWT_REFRESH_TIME: Joi.string().default('7d'),
                MAIL_HOST: Joi.string(),
                MAIL_PORT: Joi.number().port(),
                MAIL_USERNAME: Joi.string(),
                MAIL_PASSWORD: Joi.string(),
                MAIL_ENCRYPTION: Joi.boolean(),
                MAIL_FROM_ADDRESS: Joi.string(),
                MAIL_FROM_NAME: Joi.string(),
                DEFAULT_AVATAR_PATH: Joi.string(),
            }),
            validationOptions: {
                abortEarly: true,
            },
        }),
        ServeStaticModule.forRoot({
            rootPath: path.join(__dirname, '..', '..', 'public'),
            serveStaticOptions: {
                index: false,
            },
        }),
        JwtModule.register({
            global: true,
        }),
        MailerModule.forRootAsync({
            useFactory: async (
                configService: ConfigService,
            ): Promise<MailerOptions> => ({
                transport: {
                    host: configService.get<string>('MAIL_HOST'),
                    port: configService.get<number>('MAIL_PORT'),
                    secure: configService.get<boolean>('MAIL_ENCRYPTION'),
                    auth: {
                        user: configService.get<string>('MAIL_USERNAME'),
                        pass: configService.get<string>('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: configService.get<string>('MAIL_FROM_ADDRESS'),
                },
                template: {
                    dir: path.join(__dirname, 'templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),
            inject: [ConfigService],
        }),
        AuthModule,
        PostModule,
        CommentModule,
        CategoryModule,
        AdminModule.forRootAsync(),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: JwtGuard,
        },
    ],
})
export class AppModule {}
