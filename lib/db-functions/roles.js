const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

// Retrieves all roles from the roles table
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

// Gets the necessary information for adding a role
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
        validate: (jobTitle) => {
          if (jobTitle) {
            return true;
          } else {
            console.log("Please enter a title for the job.");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "salary",
        message: "Enter the salary of the new job:",
        validate: (salary) => {
          if (salary) {
            return true;
          } else {
            console.log("Please enter a salary.");
            return false;
          }
        },
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

// Takes care of actually adding the role with the information gathered
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
    .then(console.log(`The ${jobTitle} role has been successfully added.`))
    .catch((err) => console.log(err));
};

const deleteRoleHandler = async () => {
  let roles;
  await db
    .promise()
    .query(`SELECT job_title FROM roles`)
    .then(([rows]) => (roles = rows.map((row) => row.job_title)))
    .catch((err) => console.log(err));

  await inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "Choose a role to delete:",
        choices: roles,
      },
    ])
    .then((choice) => deleteRole(choice))
    .catch((err) => console.log(err));
};

const deleteRole = async ({ role }) => {
  await db
    .promise()
    .query(`DELETE FROM roles WHERE job_title = "${role}"`)
    .then(console.log(`The ${role} role has been deleted`))
    .catch((err) => console.log(err));
};

module.exports = { getAllRoles, addRoleHandler, deleteRoleHandler };
