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
import * as bcrypt from 'bcryptjs';
import { authPayloadDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { Public } from 'src/role/public.decorator';
import { CompanyService } from 'src/company/company.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    private companyService: CompanyService,
  ) {}

  @Post('/signup')
  @Public()
  async signUp(@Body() payload: authPayloadDto) {
    try {
      const hashPassword = await bcrypt.hash(payload.password, 10);
      const findUser = await this.authService.validateUser(payload.email);

      if (findUser) {
        throw new ConflictException({ message: 'Email is already exits' });
      }

      const user = await this.authService.createUser({
        email: payload.email,
        password: hashPassword,
        role: 'USER',
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
  @Public()
  async login(@Body() payload: authPayloadDto) {
    try {
      const user = await this.authService.validateUser(payload.email);

      if (!user) {
        throw new NotFoundException({ message: 'User not found' });
      }

      if (user.status !== 'APPROVED' && user.company.status !== 'APPROVED') {
        throw new UnauthorizedException({
          message: 'User is not approved yet',
        });
      }

      const compare = await bcrypt.compare(payload.password, user.password);

      if (!compare) {
        throw new UnauthorizedException({ message: 'email or password wrong' });
      }

      return {
        token: this.jwtService.sign({
          sub: user.id,
          email: user.email,
          role: user.role,
        }),
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      };
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'Something went worng',
        err: err?.response?.message,
      });
    }
  }

  @Get()
  async getAuth() {
    return 'auth';
  }
}
