const { Pool } = require('pg')

module.exports = new Pool ({
    user: "postgres",
    password: "ro070656",
    host: "localhost",
    port: 5432,
    database: "launchstore",
})