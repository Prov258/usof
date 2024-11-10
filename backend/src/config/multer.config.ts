import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid } from 'uuid';
import { Request } from 'express';
import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';

export const multerOptions = {
    storage: diskStorage({
        destination: (req: Request, file: Express.Multer.File, cb: any) => {
            const destPath = join(__dirname, '..', '..', 'public', 'avatars');

            if (!existsSync(destPath)) {
                mkdirSync(destPath, { recursive: true });
            }

            cb(null, destPath);
        },
        filename: (req: Request, file: Express.Multer.File, cb: any) => {
            cb(null, `${uuid()}${extname(file.originalname)}`);
        },
    }),
    fileFilter: (req: Request, file: Express.Multer.File, cb: any) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
            cb(null, true);
        } else {
            cb(
                new HttpException(
                    `Unsupported file type ${extname(file.originalname)}`,
                    HttpStatus.BAD_REQUEST,
                ),
                false,
            );
        }
    },
};
