import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { Public } from 'src/role/public.decorator';
import { CompanyDto } from './dto/company.dto';
import { AuthService } from 'src/auth/auth.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/')
  @Public()
  async create(@Body() payload: CompanyDto) {
    try {
      const company = await this.companyService.createCompany(payload);

      const hashPass = await hash(payload.password, 10);
      const superAdmin = await this.authService.createUser({
        email: payload.email,
        password: hashPass,
        role: 'ADMIN',
        companyId: company.id,
        status: company.status,
      });

      return {
        message: 'Company created successfully',
        data: {
          company,
          user: {
            email: superAdmin.email,
            role: superAdmin.role,
          },
        },
        // token: this.jwtService.sign({
        //   email: company.email,
        //   companyId: company.id,
        //   role: superAdmin.role,
        // }),
      };
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'something went wrong',
        err,
      });
    }
  }

  @Get('/')
  @Public()
  async getAll() {
    return 'company';
  }
}
