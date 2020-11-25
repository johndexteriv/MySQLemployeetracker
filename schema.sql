DROP DATABASE IF EXISTS myBusinessDB;
CREATE DATABASE myBusinessDB;

USE myBusinessDB;

CREATE TABLE department(
    id INT NOT NULL PRIMARY KEY,
    name VARCHAR (30)
);

CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY,
    title VARCHAR (30),
    salary DECIMAL (12,2),
    department_id INT
);

CREATE TABLE employee (
    employeeid INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;