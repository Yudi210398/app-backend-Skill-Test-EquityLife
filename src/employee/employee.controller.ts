import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { TransaksiDTO } from './dto/transaksi.dto';

@Controller('api_fe')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService,
    private authSevice: AuthService,
  ) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() data: LoginDTO) {
    return this.authSevice.login(data);
  }

  @UseGuards(JwtGuard)
  @Get('list_employee')
  async dataEmployeeGet() {
    return this.employeeService.getData();
  }

  @UseGuards(JwtGuard)
  @Post('postdata')
  async inputTransaksi(@Body() data: TransaksiDTO[]) {
    return this.employeeService.processTransactions(data);
  }
}
