import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import * as bcrypt from 'bcrypt';

@Global()
@Module({
  providers: [
    {
      provide: 'PG_CONNECTION',
      useFactory: async (logger: Logger) => {
        const pool = new Pool({
          host: 'localhost',
          user: 'postgres',
          port: 5432,
          password: process.env.PASSPOSTGRE, // Ambil password dari environment variable
          database: 'testptequitylife',
        });

        try {
          // Mencoba koneksi ke database dengan query sederhana
          await pool.query('SELECT NOW()'); // Query sederhana untuk menguji koneksi
          const data = await pool.query(`SELECT * FROM tbl_admin`);

          if (data.rowCount === 0) {
            const teksSql = `INSERT INTO tbl_admin (username, password)
            VALUES ($1, $2)
            RETURNING *; 
            `;

            return await pool.query(teksSql, [
              'admin123',
              await bcrypt.hash('admin123', 10), // Hashing password
            ]);
          }

          logger.warn('Successfully connected to the database');
        } catch (error) {
          logger.error('Failed to connect to the database', {
            error: error.message,
          });
          throw error; // Gagal koneksi, hentikan eksekusi
        }

        return pool;
      },
      inject: [WINSTON_MODULE_NEST_PROVIDER], // Inject Winston logger ke useFactory
    },
  ],
  exports: ['PG_CONNECTION'],
})
export class DatabaseModule {}
