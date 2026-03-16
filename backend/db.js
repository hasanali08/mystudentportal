const { Pool } = require("pg")

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "student_command_centre",
  password: "hasan12",
  port: 5432,
})

// Test connection on startup
pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err.message);
});

module.exports = pool
