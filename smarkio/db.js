const Pool = require("pg").Pool

const pool = new Pool({
    user:"postgres",
    password:"smarkio123",
    database:"weather_database",
    host:"localhost",
    port:5432
})

module.exports = pool