const inquirer = require("inquirer");
const db = require("../../db/connection");
const cTable = require("console.table");

// Retrieves all departments from the table
const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows]) => {
      console.log(cTable.getTable(rows));
    })
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

module.exports = {
  getAllDepartments,
  addDepartmentHandler,
};
