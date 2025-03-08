import {
  Body,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { authPayloadDto } from './dto/auth.dto';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(@Body(new ValidationPipe()) payload: authPayloadDto) {
    try {
      const hashPassword = await bcrypt.hash(payload.password, 10);
      const findUser = await this.authService.validateUser(payload.email);

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

  @Post('/login')
  async login(@Body(new ValidationPipe()) payload: authPayloadDto) {
    const user = await this.authService.validateUser(payload.email);

    if (!user) {
      throw new NotFoundException({ message: 'User not found' });
    }

    const compare = bcrypt.compareSync(payload.password, user.password);

    if (!compare) {
      throw new UnauthorizedException({ message: 'email or password wrong' });
    }

    return {
      token: this.jwtService.sign({ sub: user.id, email: user.email }),
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Get()
  async getAuth() {
    return 'auth';
  }
}
