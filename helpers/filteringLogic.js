const conversions = {
  categories: {
    priority: {
      High: "priority BETWEEN 4 AND 5",
      Medium: "priority BETWEEN 2 AND 3",
      Low: "priority = 1",
    },
    status: {
      Completed: "status = 3",
      "In Progress": "status = 2",
      "Lightly/Unplayed": "status = 1",
      "Stopped Playing": "status = 0",
      //Similar idea to rating, might add a category like "Not going to play" for crappy games
    },
    //honestly, probably going to change status to numbers then keep a translation table to make filtering easy
    rating: {
      "Worth it": "rating BETWEEN 3 AND 4",
      "Not worth it": "rating BETWEEN 1 AND 2",
      //Think I'll change rating to default to 0 and display a different icon while it's in progress
    },
  },
  orderDirections: {
    "High -> Low": "DESC",
    "Low -> High": "ASC",
  },
};

function createSql(category, filter, orderBy, direction) {
  if (
    (category === "priority" && orderBy === "rating") ||
    (category === "rating" && orderBy === "priority")
  ) {
    console.log(
      "ERROR: Games with priority aren't rated, while games with ratings have no priority. Cannot fulfill that filter."
    );
    return;
  } else {
    let filterStr = "";
    let orderStr = "";
    if (category !== "N/A") {
      filterStr = conversions.categories[category][filter];
    }
    if (orderBy !== "N/A") {
      orderBy = orderBy.toLowerCase();
      // if (category !== "N/A") {
      //   orderStr += " AND";
      // }
      switch (orderBy) {
        case "post date":
          orderBy = orderBy.replace(" ", "_");
          break;
        case "priority":
          orderStr += " AND rating = 0";
          break;
        case "rating":
          orderStr += " AND priority = 0";
          break;
        case "status":
          //might need to put some logic here? I dunno
          break;
        default:
          console.log("ERROR: Invalid option!");
      }
      //FINAL ADD
      orderStr += ` ORDER BY ${orderBy} ${conversions.orderDirections[direction]}`;
    }
    const sql = `SELECT * FROM game_list WHERE ${filterStr}${orderStr};`;
    return sql;
  }
}
//bit of a behemoth, hopefully it works

module.exports = createSql;
