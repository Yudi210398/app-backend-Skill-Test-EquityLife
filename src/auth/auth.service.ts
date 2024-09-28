import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from './dto/login.dto';
import { Logger } from 'winston';
import { Pool } from 'pg';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('PG_CONNECTION') readonly pool: Pool,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) readonly logger: Logger,
  ) {}

  async login(dataLogin: LoginDTO) {
    const data = await this.validate(dataLogin);
    const payload = {
      username: data.username,
    };
    this.logger.warn('Berhasil login post');
    return {
      accesToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.ACCES_TOKEN,
      }),
    };
  }

  async validate(data: LoginDTO) {
    const login = await this.pool.connect();
    try {
      const teksSql = `SELECT * from tbl_admin WHERE username = $1`;

      const result = await login.query(teksSql, [data.username]);

      if (result.rowCount === 0)
        throw new HttpException('username email tidak ditemukan', 402);

      const foundUser = result.rows[0];
      const cekPass = await bcrypt.compare(data.password, foundUser.password);

      if (!cekPass)
        throw new HttpException('Password Salah', HttpStatus.UNAUTHORIZED);

      return foundUser;
    } finally {
      login.release();
    }
    // const result = await
  }
}
