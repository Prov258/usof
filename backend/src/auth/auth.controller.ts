import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
    RegisterDto,
    EmailVerificationDto,
    SendPasswordResetDto,
    PasswordResetDto,
    LoginResponseDto,
} from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/shared/decorators/public.decorator';
import { ApiTags } from '@nestjs/swagger';
import { RefreshResponseDto } from './dto/refreshReponse.dto';
import { CurrentUser } from 'src/shared/decorators/user.decorator';
import { User } from '@prisma/client';
import {
    ApiLogin,
    ApiLogout,
    ApiRefresh,
    ApiRegister,
    ApiResetPassword,
    ApiSendPasswordReset,
    ApiSendVerification,
    ApiVerifyEmail,
} from './decorators/api-auth.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiRegister()
    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.register(registerDto);
    }

    @ApiLogin()
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @CurrentUser() user: User,
        @Response({ passthrough: true }) res,
    ): Promise<LoginResponseDto> {
        return this.authService.login(user, res);
    }

    @ApiLogout()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('logout')
    logout(@CurrentUser() user: User, @Response() res): Promise<void> {
        return this.authService.logout(user.id, res);
    }

    @ApiRefresh()
    @Public()
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(
        @CurrentUser() user: User,
        @Response({ passthrough: true }) res,
    ): Promise<RefreshResponseDto> {
        return this.authService.refreshToken(user, res);
    }

    @ApiSendVerification()
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('send-verification')
    sendVerification(
        @Body() emailVerificationDto: EmailVerificationDto,
    ): Promise<void> {
        return this.authService.sendEmailVerification(
            emailVerificationDto.email,
        );
    }

    @ApiVerifyEmail()
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Get('verify-email/:token')
    verifyEmail(@Param('token') token: string): Promise<string> {
        return this.authService.verifyEmail(token);
    }

    @ApiSendPasswordReset()
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-reset')
    sendPasswordReset(
        @Body() sendPasswordResetDto: SendPasswordResetDto,
    ): Promise<void> {
        return this.authService.sendPasswordReset(sendPasswordResetDto.email);
    }

    @ApiResetPassword()
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-reset/:token')
    resetPassword(
        @Param('token') token: string,
        @Body() passwordResetDto: PasswordResetDto,
    ): Promise<void> {
        return this.authService.resetPassword(token, passwordResetDto.password);
    }
}
