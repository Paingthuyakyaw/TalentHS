import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authPayloadDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;

  // @IsEnum(Role, {
  //   message: 'Role must be one of USER, ADMIN, MANAGER, SUPER_ADMIN',
  // })
  // role: Role;

  // @IsEnum(Status, { message: 'Status must be PENDING & ACTIVE & REJECTED' })
  // status: Status;
}
