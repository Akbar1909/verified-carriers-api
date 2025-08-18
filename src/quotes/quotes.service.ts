import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { formatToMMDDYYYY } from 'src/common/utils/dayjs.util';

@Injectable()
export class QuotesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuoteDto) {
    try {
      // 🔍 Lookup pickup + dropoff zipcode names from DB if IDs are provided
      let pickupZip: string | undefined;
      let dropoffZip: string | undefined;

      if (data.pickupId) {
        const pickup = await this.prisma.zipCode.findUnique({
          where: { id: data.pickupId },
        });
        pickupZip = pickup?.name;
      }

      if (data.dropoffId) {
        const dropoff = await this.prisma.zipCode.findUnique({
          where: { id: data.dropoffId },
        });
        dropoffZip = dropoff?.name;
      }

      // If both zipcodes are available, call external API for price
      let price = data.price ?? null;
      if (pickupZip && dropoffZip) {
        const params = new URLSearchParams({
          pickup_zip: pickupZip,
          dropoff_zip: dropoffZip,
          estimated_ship_date: formatToMMDDYYYY(data.estimatedShipDate) ?? '',
          vehicle_type: data.vehicleType ?? '',
          ship_via_id: data.shipViaId?.toString() ?? '',
          vehicle_runs: data.vehicleRuns.toString(),
          api_key: process.env.QUOTE_API_KEY,
        });

        console.log(params.toString());

        // return;

        const url = `${process.env.QUOTE_API_URL}/rest/get/price?${params.toString()}`;

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          price = result?.['1'] ?? price;
        } else {
          console.error('External API error:', response.status);
        }
      }

      // Save Quote in DB
      return this.prisma.quote.create({
        data: {
          ...data,
          estimatedShipDate: data.estimatedShipDate
            ? new Date(data.estimatedShipDate)
            : null,
          price,
        },
        include: {
          carMake: true,
          carModel: true,
          pickup: true,
          dropoff: true,
          user: true,
          company: true,
        },
      });
    } catch (error) {
      console.error(error);
      throw new HttpException('Failed to create quote', HttpStatus.BAD_GATEWAY);
    }
  }

  async findOne(id: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
      include: {
        carMake: { select: { name: true } },
        carModel: { select: { name: true } },
        pickup: true,
        dropoff: true,
        user: true,
        company: true,
      },
    });

    if (!quote) {
      throw new NotFoundException(`Quote with id ${id} not found`);
    }

    // build generalName → e.g. "2018 Toyota Camry"
    const generalName = [
      quote.carManufactureYear,
      quote.carMake?.name,
      quote.carModel?.name,
    ]
      .filter(Boolean)
      .join(' ');

    return {
      ...quote,
      carMake: quote.carMake?.name ?? null,
      carModel: quote.carModel?.name ?? null,
      generalName,
    };
  }
}
