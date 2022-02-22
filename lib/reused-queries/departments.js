const db = require("../../db/connection");

const createDepartmentsList = async () => {
  let departments;

  await db
    .promise()
    .query(`SELECT departments.name FROM departments`)
    .then(([rows]) => (departments = rows.map((row) => row.name)))
    .catch((err) => console.log(err));

  return departments;
};

module.exports = { createDepartmentsList };
