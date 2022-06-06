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
  const { title, imgSrc, completed } = req.body;
  const sql = "INSERT INTO gameList SET ?"; //yeah yeah I know, wrong naming convention, lick my booty

  connection.query(sql, { title, imgSrc, completed }, (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.post("/:id", (req, res) => {
  const { noteText, gameId } = req.body;
  const sql = "INSERT INTO gameNotes SET ?";
  // only inserting the gameId and noteText, everything else is automatically added
  connection.query(sql, { gameId, noteText }, (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.delete("/games/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM gameList WHERE id = ?";
  const sql2 = "DELETE FROM gameNotes WHERE gameId = ?";
  //could possibly make this one delete route with the param? sounds kind of unnecessary tho
  connection.query(sql2, [id], (error, results) => {
    if (error) throw error;
    console.log(results);
  });
  connection.query(sql, [id], (error, results) => {
    if (error) throw error;
    console.log(results);
  });
  //have to be in this order or foreign key constraints yknow
}); //so, usually I'd want to just chain queries, but I don't like the security implications of enabling it (increases chance of successful SQL injections)
//I mean, for this app, not that big of a deal (at least right now), but still best practice.
//I have two options
//1: Seperate queries : maybe a little slower? but that really doesn't matter, gonna do that for now
//2: Trigger inside of MYSQL : Would be a pain in the ass to debug if something goes wrong, and especially when I rewrite my tables, but I'll prob add it in cause it's cool

app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM gameNotes WHERE id = ?";
  //could possibly make this one delete route with the param? sounds kind of unnecessary tho
  connection.query(sql, [id], (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.listen("3001", () => {
  console.log("listening on 3001");
});
