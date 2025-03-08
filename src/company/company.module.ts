import { forwardRef, Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [CompanyService],
  controllers: [CompanyController],
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    JwtModule.register({
      secret: process.env.COM_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [CompanyService],
})
export class CompanyModule {}
