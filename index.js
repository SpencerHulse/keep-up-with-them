const inquirer = require("inquirer");
const { startOptions } = require("./lib/inquirer-questions/questions");
const db = require("./db/connection");
const cTable = require("console.table");

let departmentsData;

const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows]) => {
      console.log(rows);
      departmentsData = rows;
    })
    .catch(console.log);
};

const departmentsHandler = async () => {
  await getAllDepartments();
  console.log(cTable.getTable(departmentsData));
};

const choiceHandler = async (choice) => {
  if (choice.options === "View All Departments") {
    await departmentsHandler();
  }
};

inquirer.prompt(startOptions).then((choice) => choiceHandler(choice));
