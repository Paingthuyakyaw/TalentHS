import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class authPayloadDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  password: string;
}
