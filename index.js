const inquirer = require("inquirer");
const { startOptions, goAgain } = require("./lib/inquirer-questions/questions");
const db = require("./db/connection");
const cTable = require("console.table");
const { departmentsHandler } = require("./lib/db-functions/departments");

const startApplication = async () => {
  await inquirer
    .prompt(startOptions)
    .then((choice) => choiceHandler(choice))
    .catch((err) => console.error(err));

  await inquirer
    .prompt(goAgain)
    .then((choice) => {
      if (choice.again) {
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

const choiceHandler = async (choice) => {
  if (choice.options === "View All Departments") {
    await departmentsHandler();
  }
};

startApplication();
