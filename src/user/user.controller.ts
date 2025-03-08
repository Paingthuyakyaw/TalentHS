import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('user')
  userRole() {
    return 'This is user';
  }

  @Get('admin')
  adminRole() {
    return 'This is admin';
  }
}
