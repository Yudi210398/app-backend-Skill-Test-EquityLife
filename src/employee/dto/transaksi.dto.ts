import { IsNotEmpty } from 'class-validator';

export class TransaksiDTO {
  @IsNotEmpty({ message: 'Tidak Boleh kosong,' })
  employee_id: number;

  @IsNotEmpty({ message: 'Tidak Boleh kosong,' })
  amount: number;
}
