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

//filtering ideas
// WHERE priority BETWEEN 4 AND 5 -- high priority games
// WHERE priority BETWEEN 2 AND 3 -- medium priority
// WHERE priority = 1 -- lol never gonna play
// WHERE status = "Completed"
// WHERE status = "In Progress" -- games that I am playing
// WHERE status = "Lightly/Unplayed"
// ORDER BY priority DESC -- highest wants first
// ORDER BY rating

const conversions = {
  categories: {
    priority: {
      High: "WHERE priority BETWEEN 4 AND 5",
      Medium: "WHERE priority BETWEEN 2 AND 3",
      Low: "WHERE priority = 1",
    },
    status: {
      Completed: "WHERE status = 3",
      "In Progress": "WHERE status = 2",
      "Lightly/Unplayed": "WHERE status = 1",
      "Stopped Playing": "WHERE status = 0",
      //Similar idea to rating, might add a category like "Not going to play" for crappy games
    },
    //honestly, probably going to change status to numbers then keep a translation table to make filtering easy
    rating: {
      "Worth it": "WHERE rating BETWEEN 3 AND 4",
      "Not worth it": "WHERE rating BETWEEN 1 AND 2",
      "Playing/Dunno": "WHERE rating = 0",
      //Think I'll change rating to default to 0 and display a different icon while it's in progress
    },
  },
  orderDirections: {
    "High -> Low": "DESC",
    "Low -> High": "ASC",
  },
};

app.get("/", (req, res) => {
  const sql = "SELECT * FROM game_list";
  connection.query(sql, (error, results) => {
    if (error) throw error;
    res.send(results);
  });
});

app.get("/filter", (req, res) => {
  let { filter, filterParam, orderBy, orderD } = req.query; //don't really like making it a let, but this is fine ig, will work better when I seperate the logic into it's own file
  let filtering = "";
  let ordering = "";
  if (filter !== "N/A") {
    filtering = conversions.categories[filter][filterParam];
  }
  if (orderBy !== "N/A") {
    if (orderBy === "Post date") {
      orderBy = orderBy.replace(" ", "_");
    }

    ordering = `ORDER BY ${orderBy.toLowerCase()} ${
      conversions.orderDirections[orderD]
    }`;
  } //motherfuckin build a SQL workshop
  //should eventually move this and all the associated stuff (conversions variable) into a separate helper
  const sql = `SELECT * FROM game_list ${filtering} ${ordering};`;

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
  let { title, image_source, status, priority, rating } = req.body;
  const sql = "INSERT INTO game_list SET ?";

  if (status == 3 || status == 0) {
    priority = 0;
  } else {
    rating = 0;
  } //same as below
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
  let { title, image_source, status, priority, rating } = req.body;
  if (status == 3 || status == 0) {
    priority = 0;
  } else {
    rating = 0;
  } //if a game is complete, set the priority to 0, otherwise, set the rating to 0
  // validation is also on the client side, will figure out which to keep
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
