const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

const getAllRoles = async () => {
  await db
    .promise()
    .query(
      `
      SELECT roles.id, roles.job_title, departments.name AS department, roles.salary
      FROM roles
      LEFT JOIN departments
      ON roles.department_id = departments.id;
      `
    )
    .then(([rows]) => {
      console.log(cTable.getTable(rows));
    })
    .catch((err) => console.log(err));
};

const addRoleHandler = async () => {
  let departments;
  await db
    .promise()
    .query(`SELECT departments.name FROM departments`)
    .then(([rows]) => (departments = rows.map((row) => row.name)))
    .catch((err) => console.log(err));

  await inquirer
    .prompt([
      {
        type: "input",
        name: "jobTitle",
        message: "Enter the title of the new job:",
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the new job:",
      },
      {
        type: "list",
        name: "role",
        message: "Choose the relevant department for the new role:",
        choices: departments,
      },
    ])
    .then((choices) => addRole(choices))
    .catch((err) => console.log(err));
};

const addRole = async ({ jobTitle, salary, role }) => {
  let departmentID;

  await db
    .promise()
    .query(`SELECT id FROM departments WHERE name = "${role}"`)
    .then((row) => (departmentID = row[0][0].id))
    .catch((err) => console.log(err));

  await db
    .promise()
    .query(
      `
      INSERT INTO roles (job_title, salary, department_id)
      VALUES ("${jobTitle}", "${salary}", "${departmentID}")
      `
    )
    .then(`The ${jobTitle} role has been successfully added.`)
    .catch((err) => console.log(err));
};

module.exports = { getAllRoles, addRoleHandler };
