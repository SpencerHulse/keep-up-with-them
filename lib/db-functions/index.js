const inquirer = require("inquirer");
const db = require("../../db/connection");
// Department Functions
const {
  getAllDepartments,
  addDepartmentHandler,
  departmentalBudgets,
} = require("./departments");
// Role Functions
const { getAllRoles, addRoleHandler } = require("./roles");
// Employee Functions
const {
  getAllEmployees,
  addEmployeeHandler,
  updateEmployeeRoleHandler,
  employeesByManagerHandler,
  managerChangeHandler,
  viewByDepartmentHandler,
} = require(".//employees");

// Handles starting the application and asking users for a choice of action
const startApplication = async () => {
  await inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "Add a Department",
          "View Departmental Budgets",
          "View All Roles",
          "Add a Role",
          "View All Employees",
          "View Employees By Manager",
          "View Employees By Department",
          "Add An Employee",
          "Update An Employee's Role",
          "Change An Employee's Manager",
          "Quit",
        ],
      },
    ])
    .then((choice) => choiceHandler(choice))
    .catch((err) => console.error(err));
};

// Handles utilizing the right function based on the choice made in inquirer
const choiceHandler = async ({ options: choice }) => {
  switch (choice) {
    case "View All Departments":
      await getAllDepartments();
      break;
    case "Add a Department":
      await addDepartmentHandler();
      break;
    case "View Departmental Budgets":
      await departmentalBudgets();
      break;
    case "View All Roles":
      await getAllRoles();
      break;
    case "Add a Role":
      await addRoleHandler();
      break;
    case "View All Employees":
      await getAllEmployees();
      break;
    case "View Employees By Manager":
      await employeesByManagerHandler();
      break;
    case "View Employees By Department":
      await viewByDepartmentHandler();
      break;
    case "Add An Employee":
      await addEmployeeHandler();
      break;
    case "Update An Employee's Role":
      await updateEmployeeRoleHandler();
      break;
    case "Change An Employee's Manager":
      await managerChangeHandler();
      break;
    default:
      exitApplication();
      break;
  }

  if (choice !== "Quit") {
    await againHandler();
  }
};

// Handles asking whether the user wants to make another choice
const againHandler = async () => {
  await inquirer
    .prompt([
      {
        type: "confirm",
        name: "again",
        message: "Would you like to do anything else?",
        default: true, //change to false before turning it in
      },
    ])
    .then(({ again }) => {
      if (again) {
        startApplication();
      } else {
        exitApplication();
      }
    })
    .catch((err) => console.error(err));
};

// Handles closing the db and exiting the application
const exitApplication = () => {
  console.log("Goodbye!");
  db.end();
};

module.exports = { startApplication };
