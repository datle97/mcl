import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as TRequest } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportDto } from './dtos/report.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(ReportDto)
  async createReport(
    @Body()
    body: CreateReportDto,
    @Request()
    request: TRequest,
  ) {
    const user = request.currentUser;
    return this.reportsService.create(body, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  async approveReport(
    @Param('id')
    id: string,
    @Body()
    body: ApproveReportDto,
  ) {
    return this.reportsService.approveReport(+id, body);
  }
}
