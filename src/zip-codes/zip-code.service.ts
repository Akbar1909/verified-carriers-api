import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ZipCodeService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string) {
    if (!query || query.trim() === '') return [];

    return this.prisma.$queryRawUnsafe(
      `
      SELECT * FROM "ZipCode"
      WHERE 
        "name" ILIKE '%' || $1 || '%' OR
        "primary_city" ILIKE '%' || $1 || '%' OR
        "state" ILIKE '%' || $1 || '%' OR
        "county" ILIKE '%' || $1 || '%'
      LIMIT 20
    `,
      query,
    );
  }
}
