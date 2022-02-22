const db = require("../../db/connection");
const cTable = require("console.table");

let rolesData;

const getAllRoles = async () => {
  await db
    .promise()
    .query(`SELECT * FROM roles`)
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
