import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty({ message: 'Tidak Boleh kosong,' })
  username: string;

  @IsNotEmpty({ message: 'Tidak Boleh kosong,' })
  password: string;
}
