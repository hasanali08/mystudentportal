const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "student_command_center",
  password: "hasan12",
  port: 5432,
})

module.exports = pool
