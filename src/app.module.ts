import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { DatabaseModule } from './database/database.module';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CommonModule, DatabaseModule, EmployeeModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
