export const fungsiReturnDataId = async (transaksiPg, employee_id: number) => {
  const cari = `SELECT * from tbl_employee where employee_id = $1`;
  const value = Number(employee_id);

  return await transaksiPg.query(cari, [value]);
};
