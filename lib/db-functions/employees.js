const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

const { createDepartmentsList } = require("../reused-queries/departments");

const {
  createRolesList,
  createEmployeeList,
  getManagerID,
  getRoleID,
  multipleSameName,
} = require("../reused-queries/employees");

// Handles getting all employee information from multiple tables
const getAllEmployees = async () => {
  // The query returns: ID, first/last name, job, department, salary, manager
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
  let roles = await createRolesList();
  let employeeList = await createEmployeeList();

  await inquirer
    .prompt([
      {
        type: "input",
        name: "firstName",
        message: "Enter the employee's first name:",
        validate: (firstName) => {
          if (firstName) {
            return true;
          } else {
            console.log("Please enter a first name.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "Enter the employee's last name:",
        validate: (lastName) => {
          if (lastName) {
            return true;
          } else {
            console.log("Please enter a last name.");
            return false;
          }
        },
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
        choices: employeeList,
      },
    ])
    .then((choices) => addEmployee(choices))
    .catch((err) => console.log(err));
};

// Handles actually adding an employee
const addEmployee = async ({ firstName, lastName, role, manager }) => {
  let managerID = await getManagerID(manager);
  let roleID = await getRoleID(role);

  // Adds a new employee with the given information
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
  let employees = await createEmployeeList();
  let roles = await createRolesList();

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
    .then((choices) => updateRole(choices, employees))
    .catch((err) => console.log(err));
};

// Handles actually adding an employee
const updateRole = async ({ employee, newRole }) => {
  let employeeArray = await multipleSameName(employee);
  let roleID = await getRoleID(newRole);

  if (employeeArray.length > 1) {
    console.log(cTable.getTable(employeeArray));
    await inquirer
      .prompt({
        type: "input",
        name: "id",
        message: "Please enter the ID of the employee you wish to update:",
        validate: (id) => {
          if (id) {
            return true;
          } else {
            console.log("Please enter an ID.");
            return false;
          }
        },
      })
      .then((data) =>
        db
          .promise()
          .query(
            `
            UPDATE employees
            SET role_id = ${roleID}
            WHERE id = "${data.id}"
            `
          )
          .then(console.log(`${employee}'s role has changed to ${newRole}.`))
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  } else {
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
  }
};

// Handles gathering information to create tables of employees by their manager
const employeesByManagerHandler = async () => {
  // Gets a list of current managers
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

// Creates a table of employees under a certain manager
const viewEmployeesByManager = async ({ manager }) => {
  // Retrieves a list of employees who are under the chosen manager
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

// Handles getting information to change manager
const managerChangeHandler = async () => {
  let employees = await createEmployeeList();
  let chosenEmployee;
  // Prompt for employee choice
  await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Choose the employee you wish to place under a new manager:",
        choices: employees,
      },
    ])
    .then((choice) => (chosenEmployee = choice.employee))
    .catch((err) => console.log(err));

  // Remove chosen employee from list of potential employee manager's
  let managers = employees.filter((employee) => employee !== chosenEmployee);
  let chosenManager;
  // Prompt for manager choice
  await inquirer
    .prompt([
      {
        type: "list",
        name: "manager",
        message: "Choose their new manager:",
        choices: managers,
      },
    ])
    .then((choice) => (chosenManager = choice.manager))
    .catch((err) => console.log(err));

  await managerChange(chosenEmployee, chosenManager);
};

// Handles changing the manager
const managerChange = async (employee, manager) => {
  let managerID = await getManagerID(manager);
  let employeeArray = await multipleSameName(employee);

  if (employeeArray.length > 1) {
    console.log(cTable.getTable(employeeArray));
    await inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: "Please enter the ID of the employee you wish to update:",
          validate: (id) => {
            if (id) {
              return true;
            } else {
              console.log("Please enter an ID.");
              return false;
            }
          },
        },
      ])
      .then((data) => {
        db.promise()
          .query(
            `
            UPDATE employees
            SET manager_id = "${managerID}"
            WHERE id = "${data.id}"
            `
          )
          .then(console.log(`${employee}'s manager has changed to ${manager}.`))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    await db
      .promise()
      .query(
        `
        UPDATE employees
        SET manager_id = "${managerID}"
        WHERE CONCAT(first_name, " ", last_name) = "${employee}"
        `
      )
      .then(console.log(`${employee}'s manager has changed to ${manager}.`))
      .catch((err) => console.log(err));
  }
};

// Handles getting information for viewing by departments
const viewByDepartmentHandler = async () => {
  let departments = await createDepartmentsList();

  await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose a department:",
        choices: departments,
      },
    ])
    .then((choice) => viewDepartmentEmployees(choice))
    .catch((err) => console.log(err));
};

// Creates a table of the chosen department
const viewDepartmentEmployees = async ({ department }) => {
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
      WHERE departments.name = "${department}";
      `
    )
    .then(([rows]) => console.log(cTable.getTable(rows)))
    .catch((err) => console.log(err));
};

const deleteEmployeeHandler = async () => {
  let employees = await createEmployeeList();

  await inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Choose an employee to delete",
        choices: employees,
      },
    ])
    .then((choice) => deleteEmployee(choice))
    .catch((err) => console.log(err));
};

const deleteEmployee = async ({ employee }) => {
  let employeeArray = await multipleSameName(employee);

  if (employeeArray.length > 1) {
    console.log(cTable.getTable(employeeArray));
    await inquirer
      .prompt([
        {
          type: "input",
          name: "id",
          message: "Please enter the ID of the employee you want to delete:",
          validate: (id) => {
            if (id) {
              return true;
            } else {
              console.log("Please enter an ID.");
              return false;
            }
          },
        },
      ])
      .then((data) => {
        // Deletes the department by ID
        db.promise()
          .query(`DELETE FROM employees WHERE id = "${data.id}"`)
          .then(console.log(`${employee} has been deleted.`))
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } else {
    await db
      .promise()
      .query(
        `
      DELETE FROM employees
      WHERE CONCAT(first_name, " ", last_name) = "${employee}"
      `
      )
      .then(console.log(`${employee} has been deleted.`))
      .catch((err) => console.log(err));
  }
};

module.exports = {
  getAllEmployees,
  addEmployeeHandler,
  updateEmployeeRoleHandler,
  employeesByManagerHandler,
  managerChangeHandler,
  viewByDepartmentHandler,
  deleteEmployeeHandler,
};
