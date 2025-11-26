const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: "217.21.87.103",
    user: "u205680228_raman",
    password: "ajay25Raman",
    database: "u205680228_e_commerce",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection()
    .then(conn => {
        console.log("Connected to database!");
        conn.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

module.exports = pool;