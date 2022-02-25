const db = require("../../db/connection");

// Creates a list of possible roles
const createRolesList = async () => {
  let rolesList;

  await db
    .promise()
    .query(`SELECT job_title FROM roles`)
    .then(([rows]) => (rolesList = rows.map((row) => row.job_title)))
    .catch((err) => console.log(err));

  return rolesList;
};

// Creates a list of employees
const createEmployeeList = async () => {
  let employeeList;

  await db
    .promise()
    .query(
      `
    SELECT CONCAT(first_name, " ", last_name) AS employees
    FROM employees
    `
    )
    .then(([rows]) => (employeeList = rows.map((row) => row.employees)))
    .catch((err) => console.log(err));

  return employeeList;
};

// Gets a manager's ID from their full name
const getManagerID = async (manager) => {
  let managerID;

  await db
    .promise()
    .query(
      `
    SELECT id
    FROM employees
    WHERE CONCAT(first_name, " ", last_name) = "${manager}";
    `
    )
    .then(([row]) => (managerID = row[0].id))
    .catch((err) => console.log(err));

  return managerID;
};

// Gets the role ID using the role name
const getRoleID = async (role) => {
  let roleID;

  await db
    .promise()
    .query(
      `
    SELECT id
    FROM roles
    WHERE job_title =  "${role}"
    `
    )
    .then(([row]) => (roleID = row[0].id))
    .catch((err) => console.log(err));

  return roleID;
};

const multipleSameName = async (employee) => {
  let employeeArray;

  await db
    .promise()
    .query(
      `
    SELECT employees.id, CONCAT(employees.first_name, " ", employees.last_name) AS name, roles.job_title
    FROM employees
    LEFT JOIN roles
    ON employees.role_id = roles.id
    WHERE CONCAT(first_name, " ", last_name) = "${employee}"
    `
    )
    .then(([rows]) => (employeeArray = rows))
    .catch((err) => console.log(err));

  return employeeArray;
};

module.exports = {
  createRolesList,
  createEmployeeList,
  getManagerID,
  getRoleID,
  multipleSameName,
};
