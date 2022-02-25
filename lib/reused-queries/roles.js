const db = require("../../db/connection");

const createRolesList = async () => {
  let roles;

  await db
    .promise()
    .query(`SELECT job_title FROM roles`)
    .then(([rows]) => (roles = rows.map((row) => row.job_title)))
    .catch((err) => console.log(err));

  return roles;
};

module.exports = { createRolesList };
