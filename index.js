require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env;
const express = require("express");
const app = express();

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: SQL_USER,
  password: SQL_PASSWORD,
  database: "games",
});

connection.connect(function (err) {
  if (err) {
    console.log(err.stack);
    return;
  }

  console.log("connected");
});

app.get("/", (req, res) => {
  const sql = "SELECT * FROM gameList";

  connection.query(sql, (error, results) => {
    console.log(results);
    res.send(results);
  });
});

app.post("/", (req, res) => {
  const { title, imgSrc } = req.body;
  const sql = "INSERT INTO gameList SET ?"; //yeah yeah I know, wrong naming convention, lick my booty

  connection.query(sql, { title, imgSrc }, (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.listen("3001", () => {
  console.log("listening on 3001");
});
