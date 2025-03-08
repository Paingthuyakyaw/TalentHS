import { Injectable } from '@nestjs/common';
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
    });

    if (user) {
      return user;
    }
    return null;
  }

  async createUser(payload: { email: string; password: string }) {
    return this.prisma.user.create({
      data: {
        email: payload.email,
        password: payload.password,
        role: 'USER',
        status: 'PENDING',
      },
    });
  }
}
