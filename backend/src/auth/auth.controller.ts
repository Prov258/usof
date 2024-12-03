import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Request,
    Response,
    UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Public } from 'src/decorators/public.decorator';
import { EmailVerificationDto } from './dto/emailVerification.dto';
import { SendPasswordResetDto } from './dto/sendPasswordReset.dto';
import { PasswordResetDto } from './dto/passwordReset.dto';
import { LoginResponseDto } from './dto/loginReponse.dto';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshResponseDto } from './dto/RefreshReponse.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiOperation({ summary: 'User registration' })
    @ApiBody({ type: RegisterDto })
    @ApiCreatedResponse({ description: 'User registered' })
    @ApiBadRequestResponse({ description: 'User already exists' })
    @Public()
    @Post('register')
    register(@Body() registerDto: RegisterDto): Promise<void> {
        return this.authService.register(registerDto);
    }

    @ApiOperation({ summary: 'User login' })
    @ApiBody({ type: LoginDto })
    @ApiOkResponse({ type: LoginResponseDto })
    @ApiBadRequestResponse({ description: "User doesn't exist" })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
    @HttpCode(HttpStatus.OK)
    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Request() req,
        @Response({ passthrough: true }) res,
    ): Promise<LoginResponseDto> {
        return this.authService.login(req.user, res);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'User logout' })
    @ApiNoContentResponse({ description: 'User logged out' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @Get('logout')
    logout(@Request() req, @Response() res): Promise<void> {
        return this.authService.logout(req.user.id, res);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Refresh JWT access token' })
    @ApiCreatedResponse({ type: LoginResponseDto })
    @ApiBadRequestResponse({ description: "User doesn't exist" })
    @ApiUnauthorizedResponse({ description: 'Invalid refresh token' })
    @Public()
    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    refresh(
        @Request() req,
        @Response({ passthrough: true }) res,
    ): Promise<RefreshResponseDto> {
        return this.authService.refreshToken(
            req.user.sub,
            req.user.refreshToken,
            res,
        );
    }

    @ApiOperation({ summary: 'Send email verification' })
    @ApiBody({ type: EmailVerificationDto })
    @ApiNoContentResponse({ description: 'Email sent' })
    @ApiBadRequestResponse({ description: "User doesn't exist" })
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

    @ApiOperation({ summary: 'Verify email' })
    @ApiNoContentResponse({ description: 'Email verified' })
    @ApiBadRequestResponse({ description: 'Invalid token' })
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Get('verify-email/:token')
    verifyEmail(@Param('token') token: string): Promise<void> {
        return this.authService.verifyEmail(token);
    }

    @ApiOperation({ summary: 'Send reset password email' })
    @ApiBody({ type: SendPasswordResetDto })
    @ApiNoContentResponse({ description: 'Email sent' })
    @ApiBadRequestResponse({ description: "User doesn't exist" })
    @Public()
    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-reset')
    sendPasswordReset(
        @Body() sendPasswordResetDto: SendPasswordResetDto,
    ): Promise<void> {
        return this.authService.sendPasswordReset(sendPasswordResetDto.email);
    }

    @ApiOperation({ summary: 'Reset password' })
    @ApiBody({ type: PasswordResetDto })
    @ApiNoContentResponse({ description: 'Password reset' })
    @ApiBadRequestResponse({ description: 'Invalid token' })
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
