import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { OtpType, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private prisma: PrismaService,
        private configService: ConfigService,
        private mailService: MailerService,
    ) {}

    async register(registerDto: RegisterDto) {
        const userExists = await this.prisma.user.findFirst({
            where: {
                OR: [
                    { login: registerDto.login },
                    { email: registerDto.email },
                ],
            },
        });

        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const newUser = await this.userService.create({
            ...registerDto,
            password: hashedPassword,
        });

        await this.sendEmailVerification(newUser.email);
    }

    async login(user: User) {
        const tokens = await this.generateTokens(user.id, user.login);
        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: number) {
        return await this.userService.update(userId, { refreshToken: null });
    }

    async sendPasswordReset(email: string) {
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

    async resetPassword(token: string, password: string) {
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

        await this.userService.update(otp.userId, {
            password: hashedPassword,
        });

        await this.prisma.otp.delete({
            where: {
                id: otp.id,
            },
        });
    }

    async sendEmailVerification(email: string) {
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

    async verifyEmail(token: string) {
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

        await this.userService.update(otp.userId, {
            emailVerified: true,
        });

        await this.prisma.otp.delete({
            where: {
                id: otp.id,
            },
        });
    }

    async refreshToken(userId: number, refreshToken: string) {
        const user = await this.userService.findOne(userId);

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );

        if (!refreshTokenMatches) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.generateTokens(user.id, user.login);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshedToken = await bcrypt.hash(refreshToken, 10);
        await this.userService.update(userId, {
            refreshToken: hashedRefreshedToken,
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
