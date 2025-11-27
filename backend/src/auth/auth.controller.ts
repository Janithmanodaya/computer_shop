import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

class RegisterDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsString()
  @IsOptional()
  name?: string;
}

class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterDto) {
    const result = await this.authService.register(
      body.email,
      body.password,
      body.name
    );
    return {
      data: result,
      meta: null,
      error: null
    };
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const result = await this.authService.login(body.email, body.password);
    return {
      data: result,
      meta: null,
      error: null
    };
  }
}