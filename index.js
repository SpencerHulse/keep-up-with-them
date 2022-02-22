const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");
// Department Functions
const {
  departmentsHandler,
  addDepartment,
} = require("./lib/db-functions/departments");
// Role Functions
const { rolesHandler, addRole } = require("./lib/db-functions/roles");
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
    await departmentsHandler();
  }

  if (choice === "Add a Department") {
    await inquirer
      .prompt(newDepartment)
      .then((choice) => addDepartment(choice));
  }

  if (choice === "View All Roles") {
    await rolesHandler();
  }

  if (choice === "Add a Role") {
    await addRole();
  }
};

startApplication();
