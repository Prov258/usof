import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/decorators/public.decorator';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailVerificationDto } from './dto/emailVerification.dto';
import { SendPasswordResetDto } from './dto/sendPasswordReset.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService,
    ) {}

    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user);
    }

    @UseGuards(JwtGuard)
    @Get('logout')
    logout(@Request() req) {
        return this.authService.logout(req.user.id);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(@Request() req) {
        return this.authService.refreshToken(
            req.user.sub,
            req.user.refreshToken,
        );
    }

    @Public()
    @Post('send-verification')
    sendVerification(@Body() emailVerificationDto: EmailVerificationDto) {
        return this.authService.sendEmailVerification(
            emailVerificationDto.email,
        );
    }

    @Public()
    @Get('verify-email/:token')
    verifyEmail(@Param('token') token: string) {
        return this.authService.verifyEmail(token);
    }

    @Public()
    @Post('password-reset')
    sendPasswordReset(@Body() sendPasswordResetDto: SendPasswordResetDto) {
        return this.authService.sendPasswordReset(sendPasswordResetDto.email);
    }

    @Public()
    @Post('password-reset/:token')
    resetPassword(
        @Param('token') token: string,
        @Body() passwordResetDto: PasswordResetDto,
    ) {
        return this.authService.resetPassword(token, passwordResetDto.password);
    }
}
