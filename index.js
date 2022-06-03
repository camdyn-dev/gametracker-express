require("dotenv").config();
const { SQL_USER, SQL_PASSWORD } = process.env;
const express = require("express");
const app = express();

const cors = require("cors");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: SQL_USER,
  password: SQL_PASSWORD,
  database: "games",
});

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    if (error) throw error;
    res.send(results);
  });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM gameList WHERE id = ?";
  connection.query(sql, [id], (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT noteText, DATE_FORMAT(postDate, '%b %D, %l:%i%p') AS date, id FROM gameNotes WHERE gameId = ?";

  connection.query(sql, [id], (error, results) => {
    if (error) throw error;

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

app.post("/:id", (req, res) => {
  console.log(req.body);
  const { noteText, gameId } = req.body;
  const sql = "INSERT INTO gameNotes SET ?";
  // only inserting the gameId and noteText, everything else is automatically added
  connection.query(sql, { gameId, noteText }, (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.listen("3001", () => {
  console.log("listening on 3001");
});
