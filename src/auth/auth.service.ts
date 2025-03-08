import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
// import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    // private jwt: JwtService,
  ) {}

  async validateUser(email: string) {
    const user = await this.prisma.user.findFirst({
      where: { email },
      include: {
        company: true,
      },
    });

    if (user) {
      return user;
    }
    return null;
  }

  async createUser(payload: {
    email: string;
    password: string;
    role: keyof typeof $Enums.Role;
    companyId?: string;
    status?: keyof typeof $Enums.Status;
  }) {
    return this.prisma.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        role: payload.role,
        status: payload.status,
        companyId: payload.companyId,
      },
    });
  }
}
