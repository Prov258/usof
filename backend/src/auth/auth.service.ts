import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OtpType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
import { Response } from 'express';
import { LoginResponseDto } from './dto/loginReponse.dto';
import { UserEntity } from 'src/user/dto/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private prisma: PrismaService,
        private configService: ConfigService,
        private mailService: MailerService,
    ) {}

    async register(registerDto: RegisterDto): Promise<void> {
        if (
            !(await this.userService.isUserUnique(
                registerDto.login,
                registerDto.email,
            ))
        ) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = await this.prisma.user.create({
            data: {
                ...registerDto,
                avatar: this.configService.get<string>('DEFAULT_AVATAR_PATH'),
                password: hashedPassword,
            },
        });

        await this.sendEmailVerification(newUser.email);
    }

    async login(user: User, res: Response): Promise<LoginResponseDto> {
        const { accessToken, refreshToken } = await this.generateTokens(
            user.id,
            user.login,
        );
        await this.updateRefreshToken(user.id, refreshToken);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
        });

        return { accessToken };
    }

    async logout(userId: number, res: Response): Promise<void> {
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: null,
            },
        });

        res.clearCookie('refresh_token');
    }

    async sendPasswordReset(email: string): Promise<void> {
        const users = await this.userService.findByTemplate({ email });

        if (users.length === 0) {
            throw new NotFoundException("User doesn't exist");
        }

        const user = users[0];

        const otpData = {
            userId: user.id,
            token: uuidv4(),
            type: OtpType.PASSWORD_RESET,
            expiresAt: new Date(Date.now() + 1000 * 60 * 15),
        };

        const otp = await this.prisma.otp.create({
            data: otpData,
        });

        const appUrl = this.configService.get<string>('APP_URL');

        await this.mailService.sendMail({
            to: user.email,
            subject: 'Password Reset',
            template: 'password-reset',
            context: {
                resetLink: `${appUrl}/auth/password-reset/${otp.token}`,
            },
        });
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const otp = await this.prisma.otp.findFirst({
            where: {
                token,
                type: OtpType.PASSWORD_RESET,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!otp) {
            throw new BadRequestException('Invalid OTP');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await this.prisma.user.update({
            where: {
                id: otp.userId,
            },
            data: {
                password: hashedPassword,
            },
        });

        await this.prisma.otp.delete({
            where: {
                id: otp.id,
            },
        });
    }

    async sendEmailVerification(email: string): Promise<void> {
        const users = await this.userService.findByTemplate({ email });

        if (users.length === 0) {
            throw new NotFoundException("User doesn't exist");
        }

        const user = users[0];

        if (user.emailVerified) {
            throw new BadRequestException('User already verified');
        }

        const otpData = {
            userId: user.id,
            token: uuidv4(),
            type: OtpType.EMAIL_VERIFICATION,
            expiresAt: new Date(Date.now() + 1000 * 60 * 15),
        };

        const otp = await this.prisma.otp.create({
            data: otpData,
        });

        const appUrl = this.configService.get<string>('APP_URL');

        await this.mailService.sendMail({
            to: user.email,
            subject: 'Email Verification',
            template: 'email-verification',
            context: {
                verifyLink: `${appUrl}/auth/verify-email/${otp.token}`,
            },
        });
    }

    async verifyEmail(token: string): Promise<void> {
        const otp = await this.prisma.otp.findFirst({
            where: {
                token,
                type: OtpType.EMAIL_VERIFICATION,
                expiresAt: {
                    gt: new Date(),
                },
            },
        });

        if (!otp) {
            throw new BadRequestException('Invalid OTP');
        }

        await this.prisma.user.update({
            where: {
                id: otp.userId,
            },
            data: {
                emailVerified: true,
            },
        });

        await this.prisma.otp.delete({
            where: {
                id: otp.id,
            },
        });
    }

    async refreshToken(
        userId: number,
        oldRefreshToken: string,
        res: Response,
    ): Promise<LoginResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const refreshTokenMatches = await bcrypt.compare(
            oldRefreshToken,
            user.refreshToken,
        );

        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied');
        }

        const { accessToken, refreshToken } = await this.generateTokens(
            user.id,
            user.login,
        );

        await this.updateRefreshToken(user.id, refreshToken);

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
        });

        return { accessToken };
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshedToken = await bcrypt.hash(refreshToken, 10);
        await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                refreshToken: hashedRefreshedToken,
            },
        });
    }

    async generateTokens(userId: number, login: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    login,
                },
                {
                    secret: this.configService.get<string>(
                        'JWT_REFRESH_SECRET',
                    ),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new BadRequestException("User doesn't exist");
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new UnauthorizedException('Invalid password');
        }

        return user;
    }
}