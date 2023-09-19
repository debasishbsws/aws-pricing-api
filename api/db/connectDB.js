const mysql = require("mysql2");
import dotenv from "dotenv";
dotenv.config();

const UserName = process.env.DB_USER_NAME;
const Password = process.env.DB_PASSWORD;
const Database = process.env.DATABASE_NAME;
const Host = process.env.DB_HOST;

const pool = mysql.createPool({
    host: Host,
    user: UserName,
    password: Password,
    database: Database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function executeQuery (sql, values) {
    let connection = null;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, values);
        return rows;
    } finally {
        if (connection != null) {
            connection.release();
        }
    }
}

// This function is used to test the database connection.
async function testConnection () {
    let connection = null;
    console.log(Host);
    try {
        connection = await pool.getConnection();
        console.log("Connection to the database is successful.");
    } catch (error) {
        console.error("Could not connect to the database:", error);
        throw error; // or handle the error as needed
    } finally {
        if (connection != null) {
            connection.release();
        }
    }
}

export { executeQuery, testConnection };