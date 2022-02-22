const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
// Department Functions
const {
  getAllDepartments,
  addDepartmentHandler,
} = require("./lib/db-functions/departments");
// Role Functions
const { getAllRoles, addRoleHandler } = require("./lib/db-functions/roles");
// Employee Functions
const { employeesHandler } = require("./lib/db-functions/employees");
// Inquirer Prompts
const {
  startOptions,
  goAgain,
  newDepartment,
} = require("./lib/inquirer-questions/prompts");

const startApplication = async () => {
  await inquirer
    .prompt(startOptions)
    .then((choice) => choiceHandler(choice))
    .catch((err) => console.error(err));

  await inquirer
    .prompt(goAgain)
    .then(({ again }) => {
      if (again) {
        startApplication();
      } else {
        exitApplication();
      }
    })
    .catch((err) => console.error(err));
};

const exitApplication = () => {
  console.log("Goodbye!");
  db.end();
};

const choiceHandler = async ({ options: choice }) => {
  if (choice === "View All Departments") {
    await getAllDepartments();
  }

  if (choice === "Add a Department") {
    await addDepartmentHandler();
  }

  if (choice === "View All Roles") {
    await getAllRoles();
  }

  if (choice === "Add a Role") {
    await addRoleHandler();
  }

  if (choice === "View All Employees") {
    await employeesHandler();
  }
};

startApplication();
