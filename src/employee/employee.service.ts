import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Pool } from 'pg';
import { Logger } from 'winston';
import { TransaksiDTO } from './dto/transaksi.dto';
import { fungsiReturnDataId } from './func/func';

@Injectable()
export class EmployeeService {
  constructor(
    @Inject('PG_CONNECTION') readonly pool: Pool,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) readonly logger: Logger,
  ) {}

  async getData(): Promise<any> {
    const employee = await this.pool.connect();

    try {
      const res = await employee.query(`
        SELECT 
          e.employee_id, 
          e.employee_name,
          COALESCE(m.employee_name, '(null)') AS manager_name
        FROM 
          tbl_employee e
        LEFT JOIN 
          tbl_employee m ON e.employee_manager_id = m.employee_id
        ORDER BY 
          e.employee_id;
      `);

      const hasilData = [];

      await res.rows.map((emp) => {
        let path_level = 0;
        let path_hierarchy = emp?.employee_name;
        let employee_format = emp?.employee_name;
        let currentManager = emp?.manager_name;

        while (currentManager && currentManager !== '(null)') {
          path_level++;
          path_hierarchy = currentManager + ' -> ' + path_hierarchy;
          currentManager =
            res.rows.find((e) => e.employee_name === currentManager)
              ?.manager_name || null;
        }

        employee_format = `${' '.repeat(path_level * 2)}|__${emp.employee_name}`;
        hasilData.push({ ...emp, path_level, employee_format, path_hierarchy });
      });
      this.logger.warn('Berhasil Get Data Employee');

      return hasilData;
    } finally {
      employee.release();
    }
  }

  async processTransactions(transaksis: TransaksiDTO[]) {
    const transaksiPg = await this.pool.connect();
    const dataLog = [];

    if (transaksis.length === 1) {
      const data = await fungsiReturnDataId(
        transaksiPg,
        transaksis[0].employee_id,
      );
      if (data.rows.length === 0)
        throw new HttpException(`Data tidak ditemukan`, HttpStatus.NOT_FOUND);
      console.log(data.rows);
    }

    try {
      await transaksiPg.query('BEGIN');
      for (const transaksi of transaksis) {
        const { employee_id, amount } = transaksi;

        const whereData = await fungsiReturnDataId(transaksiPg, employee_id);
        if (whereData.rowCount > 0) {
          await transaksiPg.query(
            `INSERT INTO tbl_transaksi (employee_id, amount)
              VALUES ($1, $2)`,
            [+employee_id, +amount],
          );
          dataLog.push(whereData.rows[0]);
          // Hitung fee dan simpan di tbl_fee

          await this.hitungFee(transaksiPg, employee_id, amount);
        }
      }
      await this.logData(transaksiPg, dataLog);
      await transaksiPg.query('COMMIT'); // Commit transaksi jika sukses
      this.logger.warn(
        'data berhasil terproses di tabel transaksi dan tabel log transaksi',
      );
      return {
        pesan: `data berhasil terproses di tabel transaksi dan tabel log transaksi .`,
      };
    } catch (err) {
      await transaksiPg.query('ROLLBACK'); // Rollback jika ada kesalahan
      throw new HttpException(
        `Terjadi kesalahan saat memproses transaksi, ${err.message}`,

        err.message === `Transaksi gagal karena tidak ada data id yang cocok`
          ? HttpStatus.NOT_FOUND
          : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      transaksiPg.release();
    }
  }

  async logData(transaksiPg: any, dataTranfer: string[] | number[]) {
    const totalrecods = dataTranfer.length;
    if (totalrecods === 0)
      throw new HttpException(
        `Transaksi gagal karena tidak ada data id yang cocok`,
        HttpStatus.NOT_FOUND,
      );
    const sukses = totalrecods;
    const failed = 0;

    return await transaksiPg.query(
      `INSERT INTO log_transaksi (csv_filename, total_record, total_record_failed, total_record_success, failed_id_notes)
      VALUES ($1, $2, $3, $4, $5)`,
      ['upload_json', totalrecods, failed, sukses, `tidak ada yang gagal`],
    );
  }

  async hitungFee(transaksiPg: any, employee_id: number, amount: number) {
    const fee = amount * 0.05;

    return await transaksiPg.query(
      `INSERT INTO tbl_fee (employee_id, amount_fee) 
  VALUES ($1, $2)`,
      [employee_id, fee],
    );
  }
}
