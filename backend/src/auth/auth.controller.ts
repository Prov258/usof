import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtGuard } from './guards/jwt.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/decorators/public.decorator';
import { EmailVerificationDto } from './dto/emailVerification.dto';
import { SendPasswordResetDto } from './dto/sendPasswordReset.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { LoginResponseDto } from './dto/loginReponse.dto';
import { UserEntity } from 'src/user/dto/entities/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.register(registerDto);
    }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Request() req,
        @Response({ passthrough: true }) res,
    ): Promise<LoginResponseDto> {
        return this.authService.login(req.user, res);
    }

    @UseGuards(JwtGuard)
    @Get('logout')
    logout(@Request() req, @Response() res): Promise<void> {
        return this.authService.logout(req.user.id, res);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(
        @Request() req,
        @Response({ passthrough: true }) res,
    ): Promise<LoginResponseDto> {
        return this.authService.refreshToken(
            req.user.sub,
            req.user.refreshToken,
            res,
        );
    }

    @Public()
    @Post('send-verification')
    sendVerification(
        @Body() emailVerificationDto: EmailVerificationDto,
    ): Promise<void> {
        return this.authService.sendEmailVerification(
            emailVerificationDto.email,
        );
    }

    @Public()
    @Get('verify-email/:token')
    verifyEmail(@Param('token') token: string): Promise<void> {
        return this.authService.verifyEmail(token);
    }

    @Public()
    @Post('password-reset')
    sendPasswordReset(
        @Body() sendPasswordResetDto: SendPasswordResetDto,
    ): Promise<void> {
        return this.authService.sendPasswordReset(sendPasswordResetDto.email);
    }

    @Public()
    @Post('password-reset/:token')
    resetPassword(
        @Param('token') token: string,
        @Body() passwordResetDto: PasswordResetDto,
    ): Promise<void> {
        return this.authService.resetPassword(token, passwordResetDto.password);
    }
}
