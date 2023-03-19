import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Report } from './report.entity';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

  async create(reportDto: CreateReportDto, user: User) {
    const report = this.repo.create({ ...reportDto, user });

    return this.repo.save(report);
  }

  async approveReport(id: number, attrs: Partial<Report>) {
    const report = await this.repo.findOne({ where: { id } });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    Object.assign(report, attrs);

    return this.repo.save(report);
  }

  async getEstimate(estimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = estimateDto;
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make')
      .andWhere('model = :model')
      .andWhere('lng = :lng BETWEEN -5 AND 5')
      .andWhere('lat = :lat BETWEEN -5 AND 5')
      .andWhere('year = :year BETWEEN -3 AND 3')
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage = :mileage)', 'DESC')
      .setParameters({ make, model, lng, lat, year, mileage })
      .limit(3)
      .getRawOne();
  }
}
