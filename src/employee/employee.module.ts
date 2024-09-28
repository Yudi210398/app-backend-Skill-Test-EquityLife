import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EmployeeController],
  providers: [EmployeeService, JwtService],
  imports: [AuthModule],
})
export class EmployeeModule {}
