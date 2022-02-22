const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

const getAllEmployees = async () => {
  await db
    .promise()
    .query(
      `
      SELECT
      e.id,
      e.first_name,
      e.last_name,
      roles.job_title,
      departments.name AS department,
      roles.salary,
      CONCAT(m.first_name, " ", m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles
      ON e.role_id = roles.id
      LEFT JOIN departments
      ON roles.department_id = departments.id
      LEFT JOIN employees m
      ON e.manager_id = m.id;
      `
    )
    .then(([rows]) => {
      console.log(cTable.getTable(rows));
    })
    .catch((err) => console.log(err));
};

const addEmployeeHandler = async () => {
  let roles;
  await db
    .promise()
    .query(`SELECT job_title FROM roles`)
    .then(([rows]) => (roles = rows.map((row) => row.job_title)))
    .catch((err) => console.log(err));

  let managers;
  await db
    .promise()
    .query(
      `
      SELECT CONCAT(first_name, " ", last_name) AS manager
      FROM employees
      `
    )
    .then(([rows]) => (managers = rows.map((row) => row.manager)))
    .catch((err) => console.log(err));

  await inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
      },
      {
        type: "list",
        name: "role",
        message: "Choose the employee's role:",
        choices: roles,
      },
      {
        type: "list",
        name: "manager",
        message: "Choose the employee's manager:",
        choices: managers,
      },
    ])
    .then((choices) => addEmployee(choices))
    .catch((err) => console.log(err));
};

const addEmployee = async ({ firstName, lastName, role, manager }) => {
  let managerID;
  await db
    .promise()
    .query(
      `
      SELECT id
      FROM employees
      WHERE CONCAT(first_name, " ", last_name) = "${manager}";
      `
    )
    .then(([row]) => (managerID = row[0].id))
    .catch((err) => console.log(err));

  let roleID;
  await db
    .promise()
    .query(
      `
      SELECT employees.role_id
      FROM employees
      JOIN roles
      ON employees.role_id = roles.id
      WHERE roles.job_title = "${role}"
      LIMIT 1;
      `
    )
    .then(([row]) => (roleID = row[0].role_id))
    .catch((err) => console.log(err));

  await db
    .promise()
    .query(
      `
      INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES ("${firstName}", "${lastName}", "${roleID}", "${managerID}")
      `
    )
    .then(
      console.log(
        `${firstName} ${lastName} has been successfully added as an employee.`
      )
    )
    .catch((err) => console.log(err));
};

const updateEmployeeRole = async () => {
  console.log("Howdy");
};

module.exports = { getAllEmployees, addEmployeeHandler, updateEmployeeRole };
