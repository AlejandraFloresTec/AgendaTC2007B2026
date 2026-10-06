/* eslint-disable prettier/prettier */
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { RefreshDto } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: UserService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.service.register(dto);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() dto: LoginDto) {
        return this.service.login(dto);
    }

    @Post('refresh')
    @HttpCode(200)
    refresh(@Body() dto: RefreshDto) {
        return this.service.refresh(dto);
    }
}