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

//filtering ideas
// WHERE priority BETWEEN 4 AND 5 -- high priority games
// WHERE priority BETWEEN 2 AND 3 -- medium priority
// WHERE priority = 1 -- lol never gonna play
// WHERE status = "Completed"
// WHERE status = "In Progress" -- games that I am playing
// WHERE status = "Lightly/Unplayed"
// ORDER BY priority DESC -- highest wants first
// ORDER BY rating

// const conversions = {
//   categories: {
//     priority: {
//       High: "WHERE priority BETWEEN 4 AND 5",
//       Medium: "WHERE priority BETWEEN 2 AND 3",
//       Low: "WHERE priority = 1",
//     },
//     status: {
//       Completed: "WHERE status = 3",
//       "In Progress": "WHERE status = 2",
//       "Lightly/Unplayed": "WHERE status = 1",
//       "Stopped Playing": "WHERE status = 0",
//       //Similar idea to rating, might add a category like "Not going to play" for crappy games
//     },
//     //honestly, probably going to change status to numbers then keep a translation table to make filtering easy
//     rating: {
//       "Worth it": "WHERE rating BETWEEN 3 AND 4",
//       "Not worth it": "WHERE rating BETWEEN 1 AND 2",
//       "Playing/Dunno": "WHERE rating = 0",
//       //Think I'll change rating to default to 0 and display a different icon while it's in progress
//     },
//   },
//   orderDirections: {
//     "High -> Low": "DESC",
//     "Low -> High": "ASC",
//   },
// };
