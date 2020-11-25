INSERT INTO department (id, name)
VALUES (1, 'Admin'), (2,'HR'), (3, 'Software Development'), (4, 'Finanace'), (5, 'Marketing');

INSERT INTO role(id, title, salary, department_id)
VALUES (1, 'Manager', 150000, 3), (2, 'Senior Developer', 120000, 3), (3, 'Junior Developer', 70000, 3),(4, 'Administrative Assistant', 50000, 1), (5, 'HR Associate', 60000, 2), (6, 'Accountant', 80000, 4), (7, 'Marketing Specialist', 70000, 5);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("John", "Smith", 3), ("Tracey", "Jones", 1), ("Todd", "Richards", 2), ("Kim", "Burns", 4), ("Ricky", "Stewart", 5), ("Sarah", "Littles", 6), ("Dave", "Davidson", 7);