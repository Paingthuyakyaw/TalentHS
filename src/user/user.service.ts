import { Injectable } from '@nestjs/common';
import { $Enums } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async changeStatus({
    status,
    id,
  }: {
    status: keyof typeof $Enums.Status;
    id: string;
  }) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });
  }
}
