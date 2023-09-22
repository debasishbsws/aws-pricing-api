const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const UserName = process.env.DB_USER_NAME || "dev";
const Password = process.env.DB_PASSWORD || "password";
const Database = process.env.DATABASE_NAME || "aws_pricing";
const Host = process.env.DB_HOST || "localhost";

const pool = mysql.createPool({
    host: Host,
    user: UserName,
    password: Password,
    database: Database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function executeQuery(query, params) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Could not connect to the database:", err);
                return reject(err); // Reject the promise with the error
            }

            connection.query(query, params, (queryError, results) => {
                connection.release();

                if (queryError) {
                    console.error("Error executing query:", queryError);
                    return reject(queryError); // Reject the promise with the query error
                }

                // console.log(results);
                resolve(results); // Resolve the promise with the query results
            });
        });
    });
}



// This function is used to test the database connection.
async function testConnection() {
    let connection = null;

    connection = await pool.getConnection( (err, connection) => {

        if (err) {
            console.error("Could not connect to the database:", err);
            throw err; // Handle the error as needed
        }
        console.log("Connection to the database is successful.");
    });
}

module.exports = { executeQuery, testConnection };
