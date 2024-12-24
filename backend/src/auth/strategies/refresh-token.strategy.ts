import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => request.cookies?.['refresh_token'],
            ]),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: any) {
        const oldRefreshToken = req.cookies['refresh_token'];

        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub,
            },
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('User not found');
        }

        const refreshTokenMatches = await bcrypt.compare(
            oldRefreshToken,
            user.refreshToken,
        );

        if (!refreshTokenMatches) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        return user;
    }
}
