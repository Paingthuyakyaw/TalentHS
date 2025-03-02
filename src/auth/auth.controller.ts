import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { authPayloadDto } from './dto/auth.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body(new ValidationPipe()) payload: authPayloadDto) {
    try {
      const hashPassword = await bcrypt.hash(payload.password, 10);
      const findUser = await this.authService.validateUser(payload.email);

      console.log(findUser);

      if (findUser) {
        throw new ConflictException({ message: 'Email is already exits' });
      }

      const user = await this.authService.createUser({
        email: payload.email,
        password: hashPassword,
      });

      return {
        message: 'User created successfully',
        data: user,
      };
    } catch (err) {
      if (err instanceof ConflictException) {
        throw err;
      }

      throw new InternalServerErrorException({
        success: false,
        message: 'Something went wrong!',
        error: err.message || err,
      });
    }
  }

  @Get()
  async getAuth() {
    return 'auth';
  }
}
