import { AuthService } from './auth.service';
import { Body, Controller, Get, Post, UseGuards, Request} from '@nestjs/common';
import { SignInDto } from '../dto/sign-in-dto';
import { SignUpDto } from '../dto/sign-up-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body() signUpDto: SignUpDto): Promise<{ token: string }> {
      return this.authService.signUp(signUpDto);
    }
  
    @Post('/signin')
    signIn(@Body() signInDto: SignInDto): Promise<{ token: string }> {
      return this.authService.signIn(signInDto);
    }
}
