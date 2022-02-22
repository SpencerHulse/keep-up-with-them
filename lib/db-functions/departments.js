const db = require("../../db/connection");
const cTable = require("console.table");

const departmentsData = [];

const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows]) => {
      departmentsData.push(rows);
    })
    .catch(console.log);
};

const addDepartment = async ({ departmentName }) => {
  let sql = `
  INSERT INTO departments (name)
  VALUES ("${departmentName}")
  `;
  await db
    .promise()
    .query(sql)
    .then(([result]) => {
      console.log(result);
    });
};

const departmentsHandler = async () => {
  await getAllDepartments();
  console.log(cTable.getTable(departmentsData[0]));
};

module.exports = { departmentsHandler, addDepartment };
