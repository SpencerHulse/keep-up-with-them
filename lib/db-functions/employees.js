const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

// Handles getting all employee information from multiple tables
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

// Handles gathering the information needed to add an employee
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

// Handles actually adding an employee
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
      SELECT id
      FROM roles
      WHERE roles.job_title =  "${role}"
      `
    )
    .then(([row]) => (roleID = row[0].id))
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

// Handles gathering the information to update an employees role
const updateEmployeeRoleHandler = async () => {
  let employees;
  await db
    .promise()
    .query(
      `
      SELECT CONCAT(first_name, " ", last_name) AS name
      FROM employees;
      `
    )
    .then((rows) => (employees = rows[0].map((employee) => employee.name)))
    .catch((err) => console.log(err));

  let roles;
  await db
    .promise()
    .query(`SELECT job_title FROM roles`)
    .then((rows) => (roles = rows[0].map((role) => role.job_title)))
    .catch((err) => console.log(err));

  await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Select an employee to update:",
        choices: employees,
      },
      {
        type: "list",
        name: "newRole",
        message: "Select their new role:",
        choices: roles,
      },
    ])
    .then((choices) => updateRole(choices))
    .catch((err) => console.log(err));
};

// Handles actually adding an employee
const updateRole = async ({ employee, newRole }) => {
  let roleID;
  await db
    .promise()
    .query(`SELECT id FROM roles WHERE job_title = "${newRole}"`)
    .then((row) => (roleID = row[0][0].id))
    .catch((err) => console.log(err));

  await db
    .promise()
    .query(
      `
      UPDATE employees
      SET role_id = ${roleID}
      WHERE CONCAT(first_name, " ", last_name) = "${employee}"
      `
    )
    .then(console.log(`${employee}'s role has changed to ${newRole}.`))
    .catch((err) => console.log(err));
};

const employeesByManagerHandler = async () => {
  let managers;
  await db
    .promise()
    .query(
      `
      SELECT CONCAT(m.first_name, " ", m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles
      ON e.role_id = roles.id
      LEFT JOIN departments
      ON roles.department_id = departments.id
      LEFT JOIN employees m
      ON e.manager_id = m.id
      WHERE e.manager_id
      GROUP BY e.manager_id;
      `
    )
    .then((rows) => (managers = rows[0].map((row) => row.manager)))
    .catch((err) => console.log(err));

  await inquirer
    .prompt([
      {
        type: "list",
        name: "manager",
        message: "Choose from this list of managers:",
        choices: managers,
      },
    ])
    .then((choice) => viewEmployeesByManager(choice))
    .catch((err) => console.log(err));
};

const viewEmployeesByManager = async ({ manager }) => {
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
      ON e.manager_id = m.id
      WHERE CONCAT(m.first_name, " ", m.last_name) = "${manager}"
      `
    )
    .then(([rows]) => console.log(cTable.getTable(rows)))
    .catch((err) => console.log(err));
};

const test = async () => {};

const testP2 = async () => {};

module.exports = {
  getAllEmployees,
  addEmployeeHandler,
  updateEmployeeRoleHandler,
  employeesByManagerHandler,
  test,
};

//   await db.promise().query().then().catch((err) => console.log(err))
