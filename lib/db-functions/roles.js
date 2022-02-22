const db = require("../../db/connection");
const cTable = require("console.table");

let rolesData;

const getAllRoles = async () => {
  await db
    .promise()
    .query(
      `
      SELECT roles.id, roles.job_title, departments.name AS department, roles.salary
      FROM roles
      LEFT JOIN departments
      ON roles.department_id = departments.id;
      `
    )
    .then(([rows]) => {
      rolesData = rows;
    })
    .catch(console.log);
};

const addRole = async () => {
  console.log("Test");
};

const rolesHandler = async () => {
  await getAllRoles();
  console.log(cTable.getTable(rolesData));
};

module.exports = { rolesHandler, addRole };
