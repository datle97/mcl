import { Expose, Transform } from 'class-transformer';
import { User } from 'src/users/user.entity';
import { Report } from '../report.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  approved: boolean;

  @Expose()
  price: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  mileage: number;

  @Transform(({ obj }: { obj: Report }) => obj.user.id)
  @Expose()
  userId: User;
}
