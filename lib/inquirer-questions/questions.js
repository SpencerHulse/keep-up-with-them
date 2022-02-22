const startOptions = [
  {
    type: "list",
    name: "options",
    message: "What would you like to do?",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add a Department",
      "Add a Role",
      "Add An Employee",
      "Update An Employee Role",
    ],
  },
];

module.exports = { startOptions };
