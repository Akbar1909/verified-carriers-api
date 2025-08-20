import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { CompaniesModule } from './companies/companies.module';
import { AuthModule } from './auth/auth.module';
import { ReviewModule } from './reviews/review.module';
import { LocationsModule } from './locations/locations.module';
import { ServiceModule } from './services/service.module';
import { ModeratorsModule } from './moderators/moderators.module';
import { CarModule } from './cars/cars.module';
import { ZipCodeModule } from './zip-codes/zip-code.module';
import { QuotesModule } from './quotes/quotes.module';
import { ReviewReactionModule } from './review-reactions/review-reaction.module';
import { CompanyViewModule } from './company-view/company-view.module';
import { SavedCompanyModule } from './saved-company/saved-company.module';

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
    ReviewModule,
    LocationsModule,
    ServiceModule,
    ModeratorsModule,
    CarModule,
    ZipCodeModule,
    QuotesModule,
    ReviewReactionModule,
    CompanyViewModule,
    SavedCompanyModule,
  ],
})
export class AppModule {}
