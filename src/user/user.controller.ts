import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RoleGuard } from 'src/role/role.guard';
import { $Enums, Role as role } from '@prisma/client';
import { Role } from 'src/role/role.decorator';

@Controller('/')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/user')
  @Role(role.USER)
  userRole() {
    return 'This is user';
  }

  @Get('/admin')
  @Role(role.ADMIN)
  adminRole() {
    return 'This is admin';
  }

  @Post('/user/status/:id')
  @Role(role.ADMIN)
  async changeStatus(
    @Param('id') id: string,
    @Body() { status }: { status: keyof typeof $Enums.Status },
  ) {
    try {
      await this.userService.changeStatus({ status, id });

      return {
        message: 'Successfully status change',
      };
    } catch (err) {
      throw new InternalServerErrorException({
        message: 'Server Error',
        err,
      });
    }
  }
}
