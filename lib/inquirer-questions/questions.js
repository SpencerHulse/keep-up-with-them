const startOptions = [
  {
    type: "list",
    name: "options",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "Add a Department",
      "View All Roles",
      "Add a Role",
      "View All Employees",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

const goAgain = [
  {
    type: "confirm",
    name: "again",
    message: "Would you like to do anything else?",
    default: false,
  },
];

const newDepartment = [
  {
    type: "input",
    name: "departmentName",
    message: "What is the name of the new department?",
    validate: (departmentName) => {
      if (departmentName) {
        return true;
      } else {
        console.log("Please enter a department name.");
        return false;
      }
    },
  },
];

module.exports = { startOptions, goAgain, newDepartment };
