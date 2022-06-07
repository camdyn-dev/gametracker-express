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
  const sql = "SELECT * FROM game_list";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM game_list WHERE id = ?";
  connection.query(sql, [id], (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

app.get("/notes/:id", (req, res) => {
  const { id } = req.params;
  const sql =
    "SELECT note, DATE_FORMAT(post_date, '%b %D, %l:%i%p') AS post_date, id FROM game_notes WHERE game_id = ?";

  connection.query(sql, [id], (error, results) => {
    if (error) throw error;

    res.send(results);
  });
});

app.post("/", (req, res) => {
  const { title, image_source, status, priority, rating } = req.body;
  const sql = "INSERT INTO game_list SET ?"; //yeah yeah I know, wrong naming convention, lick my booty

  connection.query(
    sql,
    { title, image_source, status, priority, rating },
    (error, results) => {
      if (error) throw error;
      console.log(results);
    }
  );
});

app.post("/:id", (req, res) => {
  const { note, game_id } = req.body;
  const sql = "INSERT INTO game_notes SET ?";
  // only inserting the gameId and noteText, everything else is automatically added
  connection.query(sql, { game_id, note }, (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.put("/games/:id", (req, res) => {
  const { id } = req.params;
  const { title, image_source, status, priority, rating } = req.body;
  const sql =
    "UPDATE game_list SET title = ?, image_source = ?, status = ?, priority = ?, rating = ? WHERE id = ?";
  connection.query(
    sql,
    [title, image_source, status, priority, rating, id],
    (error, results) => {
      if (error) throw error;
      console.log(results);
    }
  );
});

app.put("/notes/:id", (req, res) => {
  const last_modified = new Date(); //god I love the built in escaping and conversions with mysql npm
  const { id } = req.params;
  const { note } = req.body.newItems;
  const sql = "UPDATE game_notes SET note = ?, last_modified = ? WHERE id = ?";
  connection.query(sql, [note, last_modified, id], (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.delete("/games/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM game_list WHERE id = ?";
  const sql2 = "DELETE FROM game_notes WHERE game_id = ?";
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
  const sql = "DELETE FROM game_notes WHERE id = ?";
  //could possibly make this one delete route with the param? sounds kind of unnecessary tho
  connection.query(sql, [id], (error, results) => {
    if (error) throw error;
    console.log(results);
  });
});

app.listen("3001", () => {
  console.log("listening on 3001");
});
