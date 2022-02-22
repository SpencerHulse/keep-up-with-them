const db = require("../../db/connection");
const cTable = require("console.table");

let employeesData;

const getAllEmployees = async () => {
  await db
    .promise()
    .query(
      `
      SELECT
      e.id,
      e.first_name,
      e.last_name,
      roles.job_title,
      departments.name AS department,
      roles.salary,
      CONCAT(m.first_name, " ", m.last_name) AS manager
      FROM employees e
      LEFT JOIN roles
      ON e.role_id = roles.id
      LEFT JOIN departments
      ON roles.department_id = departments.id
      LEFT JOIN employees m
      ON e.manager_id = m.id;
      `
    )
    .then(([rows, fields]) => {
      console.log(cTable.getTable(rows));
    })
    .catch(console.log);
};

const employeesHandler = async () => {
  await getAllEmployees();
  console.log(cTable.getTable(employeesData));
};

module.exports = { employeesHandler };
