INSERT INTO departments (name)
VALUES
-- Departments 1-5
("Executive"),
("Human Resources"),
("Sales"),
("Secretarial"),
("Security");

INSERT INTO roles (job_title, salary, department_id)
VALUES
-- Roles 1-11
("CEO", 200000, 1),
("COO", 130000, 1),
("Head of HR", 90000, 2),
("HR Employee", 60000, 2),
("Head of Sales", 100000, 3),
("Sales Manager", 70000, 3),
("Sales Associate", 50000, 3),
("Head Secretary", 70000, 4),
("Secretarial Employee", 45000, 4),
("Chief of Security", 65000, 5),
("Security Officer", 50000, 5);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
-- CEO Role(1) Employee ID(1)
("Spencer", "Hulse", 1, null),
-- COO Role(2) Employee ID(2)
("Jesse", "Worley", 2, 1),
-- Head of HR Role(3) Employee ID(3)
("Corde", "Reynolds", 3, 2),
-- HR Employees Role(4) Employee IDs(4, 5, 6)
("Sally", "Shore", 4, 3),
("Andy", "Sadler", 4, 3),
("Malorie", "Williams", 4, 3),
-- Head of Sales Role(5) Employee ID(7)
("Jeremy", "Orlo", 5, 2),
-- Sales Managers Role(6) Employee IDs(8, 9)
("Jenny", "Slate", 6, 7),
("Frank", "Singleton", 6, 7),
-- Sales Associates Role(7) Employee IDs(10, 11, 12, 13)
("Anna", "Sinclair", 7, 8),
("Mark", "Ruffalo", 7, 8),
("Kyle", "Maki", 7, 9),
("Will", "Beckers", 7, 9),
-- Head Secretary Role(8) Employee ID(14)
("Olivia", "Prichard", 8, 1),
-- Secretarial Employees Role(9) Employee IDs(15, 16, 17, 18)
("Janis", "Monroe", 9, 14),
("Travis", "Baker", 9, 14),
("Mary", "Klaw", 9, 14),
("Oslow", "Eckers", 9, 14),
-- Chief of Security Role(10) Employee ID(19)
("Jack", "Shepard", 10, 1),
-- Security Officers Role(11) Employee IDs(20, 21, 22, 23)
("John", "Welks", 11, 19),
("Gary", "Helman", 11, 19),
("Cindy", "Lockheart", 11, 19),
("Elle", "Ravi", 11, 19);