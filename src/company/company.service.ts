import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prismaService: PrismaService) {}

  async createCompany({ name, industry, email, phone }) {
    return this.prismaService.company.create({
      data: {
        name,
        industry,
        email,
        phone,
      },
    });
  }
}
