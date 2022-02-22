const inquirer = require("inquirer");
const db = require("./db/connection");
const cTable = require("console.table");

const {
  departmentsHandler,
  addDepartment,
} = require("./lib/db-functions/departments");

const {
  startOptions,
  goAgain,
  newDepartment,
} = require("./lib/inquirer-questions/questions");

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
  } else if (choice === "Add a Department") {
    await inquirer
      .prompt(newDepartment)
      .then((departmentName) => addDepartment(departmentName));
  }
};

startApplication();
