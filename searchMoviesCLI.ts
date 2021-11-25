import { question, keyInSelect } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

console.log("Welcome to search-movies-cli!");

let route;
const choices = ["Search", "See Favourites", "Quit"];
const index = keyInSelect(choices, "Press a key to choose an option: ", {
  cancel: false,
});
route = index + 1;

if (route === 1) {
  searchMovies();
} else if (route === 2) {
  console.log("favourites: not coded yet...");
} else {
  console.log("QUIT!");
}

async function searchMovies() {
  const client = new Client({ database: "omdb" });
  let searchTerm;
  await client.connect();

  while (searchTerm !== "q") {
    searchTerm = question(`Search for what movie? (or 'q' to quit): `);
    if (searchTerm === "q") break;
    const text = `select id, name, date, runtime, budget, revenue, vote_average, votes_count
    from movies
    where kind = 'movie'
    and name ilike $1
    order by date desc
    limit 10;`;
    const values = [`%${searchTerm}%`];
    const res = await client.query(text, values);
    console.table(res.rows);
  }
  await client.end();
}
