create TABLE tbl_employee( 
employee_id serial primary key,
employee_name varchar(100) not null,
employee_manager_id int,
foreign key (employee_manager_id) references tbl_employee (employee_id)
);


CREATE TABLE tbl_transaksi (
    transaksi_id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES tbl_employee(employee_id) ON DELETE CASCADE,
    amount NUMERIC(15, 2) NOT NULL,
    tgl_transaksi TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_fee (
    fee_id SERIAL PRIMARY KEY,
    employee_id INT REFERENCES tbl_employee(employee_id) ON DELETE CASCADE,
    amount_fee NUMERIC(15, 2) NOT NULL,
    tgl_fee TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE log_transaksi (
    log_id SERIAL PRIMARY KEY,
    csv_filename VARCHAR(255) NOT NULL,
    total_record INT NOT NULL,
    total_record_failed INT NOT NULL,
    total_record_success INT NOT NULL,
    failed_id_notes TEXT,
    upload_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


SELECT * from tbl_employee where employee_id = 44;

SELECT * from tbl_transaksi;

SELECT * from tbl_fee;

SELECT * from log_transaksi;



-- DROP TABLE tbl_transaksi;

SELECT * from tbl_employee;


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




INSERT INTO tbl_employee (employee_name, employee_manager_id)
VALUES
    ('Mary', NULL),
    ('Fred', 1),
    ('Marys', 2),
    ('Vilo', 3),
    ('Mora', 2),
    ('Bil', 5),
    ('John', 6),
    ('George', 1),
    ('Chila', 8),
    ('Moya', 8),
    ('Silvy', 1),
    ('Hans', 11),
    ('Michael', 11), 
    ('Richard', 11);








SELECT * from tbl_admin WHERE username = 'admin123'


SELECT * from tbl_admin;


CREATE TABLE tbl_admin (
  admin_id SERIAL PRIMARY KEY,        
  username VARCHAR(255) UNIQUE NOT NULL, 
  password VARCHAR(255) NOT NULL,        
  role VARCHAR(50) NOT NULL DEFAULT 'admin', 
  created_at TIMESTAMP DEFAULT NOW()  
);



