const db = require("../../db/connection");
const cTable = require("console.table");

let departmentsData;

const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows]) => {
      departmentsData = rows;
    })
    .catch((err) => console.log(err));
};

const addDepartment = async ({ departmentName }) => {
  await db
    .promise()
    .query(
      `
      INSERT INTO departments (name)
      VALUES ("${departmentName}")
      `
    )
    .then(([result]) => {
      console.log(`The ${departmentName} department was successfully added.`);
    })
    .catch((err) => console.log(err));
};

const departmentsHandler = async () => {
  await getAllDepartments();
  console.log(cTable.getTable(departmentsData));
};

module.exports = {
  departmentsHandler,
  addDepartment,
};
