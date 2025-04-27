import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './reviews/review.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    FilesModule,
    CompaniesModule,
    AuthModule,
    ReviewModule
  ],
})
export class AppModule {}