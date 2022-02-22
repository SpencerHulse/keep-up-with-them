const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

const { createDepartmentsList } = require("../reused-queries/departments");

// Retrieves all departments from the table
const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows]) => console.log(cTable.getTable(rows)))
    .catch((err) => console.log(err));
};

// Handles gathering the information to add a department
const addDepartmentHandler = async () => {
  await inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter the name of the new department:",
        validate: (departmentName) => {
          if (departmentName) {
            return true;
          } else {
            console.log("Please enter a department name.");
            return false;
          }
        },
      },
    ])
    .then((department) => addDepartment(department))
    .catch((err) => console.log(err));
};

// Actually adds the new department
const addDepartment = async ({ departmentName }) => {
  await db
    .promise()
    .query(
      `
      INSERT INTO departments (name)
      VALUES ("${departmentName}")
      `
    )
    .then(
      console.log(`The ${departmentName} department was successfully added.`)
    )
    .catch((err) => console.log(err));
};

// Gets the budget utilized by each department
const departmentalBudgets = async () => {
  await db
    .promise()
    .query(
      `
      SELECT departments.name AS department, SUM(roles.salary) AS utilized_budget
      FROM employees
      LEFT JOIN roles
      ON employees.role_id = roles.id
      LEFT JOIN departments
      ON departments.id = roles.department_id
      GROUP BY departments.name;
      `
    )
    .then(([rows]) => console.log(cTable.getTable(rows)))
    .catch((err) => console.log(err));
};

const deleteDepartmentHandler = async () => {
  let departments = await createDepartmentsList();
  console.log(departments);

  await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose a department to delete:",
        choices: departments,
      },
    ])
    .then((choice) => deleteDepartment(choice))
    .catch((err) => console.log(err));
};

const deleteDepartment = async ({ department }) => {
  await db
    .promise()
    .query(`DELETE FROM departments WHERE departments.name = "${department}"`)
    .then(console.log(`The ${department} department has been deleted.`))
    .catch((err) => console.log(err));
};

module.exports = {
  getAllDepartments,
  addDepartmentHandler,
  departmentalBudgets,
  deleteDepartmentHandler,
};
