
import mysql from "mysql2/promise";
import dbConfig from "../config/db.config.js";

var connection = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB
});

// Attempt to get a connection from the pool
connection.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("Connected to the database");
    connection.release();
  }
});

export default connection;
