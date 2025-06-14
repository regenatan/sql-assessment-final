SELECT * FROM Customers INNER JOIN Companies ON Customers.company_id = Companies.company_id;

INSERT into Customers (first_name, last_name, rating, company_id) values ("tony","stare","3","1")

SELECT company_id, name from Companies;

INSERT into Companies (name, description) VALUES ("Temasek Holdings", "Richest company in singapore.");

SELECT * FROM Employees INNER JOIN Departments ON Employees.employee_id = Departments.department_id;

INSERT into Employees (first_name, last_name, department_id) values ("test1","test2","3");

DELETE from Customers where customer_id = 5;

UPDATE Customers SET first_name = "andy", last_name = "lau", rating = "1", company_id = "2"
WHERE customer_id = "7";