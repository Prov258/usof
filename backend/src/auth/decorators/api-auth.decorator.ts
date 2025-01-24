import { applyDecorators } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
    EmailVerificationDto,
    LoginDto,
    LoginResponseDto,
    PasswordResetDto,
    RegisterDto,
    SendPasswordResetDto,
} from '../dto';

export const ApiRegister = () =>
    applyDecorators(
        ApiOperation({ summary: 'User registration' }),
        ApiBody({ type: RegisterDto }),
        ApiCreatedResponse({ description: 'User registered' }),
        ApiBadRequestResponse({ description: 'User already exists' }),
    );

export const ApiLogin = () =>
    applyDecorators(
        ApiOperation({ summary: 'User login' }),
        ApiBody({ type: LoginDto }),
        ApiOkResponse({ type: LoginResponseDto }),
        ApiBadRequestResponse({ description: "User doesn't exist" }),
    );

export const ApiLogout = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'User logout' }),
        ApiNoContentResponse({ description: 'User logged out' }),
    );

export const ApiRefresh = () =>
    applyDecorators(
        ApiBearerAuth(),
        ApiOperation({ summary: 'Refresh JWT access token' }),
        ApiCreatedResponse({ type: LoginResponseDto }),
        ApiBadRequestResponse({ description: "User doesn't exist" }),
        ApiUnauthorizedResponse({ description: 'Invalid refresh token' }),
    );

export const ApiSendVerification = () =>
    applyDecorators(
        ApiOperation({ summary: 'Send email verification' }),
        ApiBody({ type: EmailVerificationDto }),
        ApiNoContentResponse({ description: 'Email sent' }),
        ApiBadRequestResponse({ description: "User doesn't exist" }),
    );

export const ApiVerifyEmail = () =>
    applyDecorators(
        ApiOperation({ summary: 'Verify email' }),
        ApiNoContentResponse({ description: 'Email verified' }),
        ApiBadRequestResponse({ description: 'Invalid token' }),
    );

export const ApiSendPasswordReset = () =>
    applyDecorators(
        ApiOperation({ summary: 'Send reset password email' }),
        ApiBody({ type: SendPasswordResetDto }),
        ApiNoContentResponse({ description: 'Email sent' }),
        ApiBadRequestResponse({ description: "User doesn't exist" }),
    );

export const ApiResetPassword = () =>
    applyDecorators(
        ApiOperation({ summary: 'Reset password' }),
        ApiBody({ type: PasswordResetDto }),
        ApiNoContentResponse({ description: 'Password reset' }),
        ApiBadRequestResponse({ description: 'Invalid token' }),
    );
