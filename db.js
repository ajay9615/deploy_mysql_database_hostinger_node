const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "217.21.87.103",
    user: process.env.DB_USER || "u205680228_raman",
    password: process.env.DB_PASSWORD || "ajay25Raman",
    database: process.env.DB_NAME || "u205680228_e_commerce",
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