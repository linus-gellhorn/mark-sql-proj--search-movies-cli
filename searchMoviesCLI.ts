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
  showFavourites();
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

    // search for query
    let text = `select id, name, date, runtime, budget, revenue, vote_average, votes_count
    from movies
    where kind = 'movie'
    and name ilike $1
    order by date desc
    limit 9;`;
    let values = [`%${searchTerm}%`];
    let res = await client.query(text, values);
    console.table(res.rows);

    // add any to favourites?
    const searchedMovies = res.rows.map((movie) => movie.name);
    const addFave =
      keyInSelect(
        searchedMovies,
        "Choose a movie to favourite or press 0 to cancel"
      ) + 1;
    if (addFave > 0) {
      console.log(`Saving favourite: ${searchedMovies[addFave - 1]}`);
      const favMovie = res.rows[addFave - 1];
      text = `INSERT INTO favourites VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
      values = [
        favMovie.id,
        favMovie.name,
        favMovie.date,
        favMovie.runtime,
        favMovie.budget,
        favMovie.revenue,
        favMovie.vote_average,
        favMovie.votes_count,
      ];
      res = await client.query(text, values);
    }
  }
  await client.end();
}

async function showFavourites() {
  const client = new Client({ database: "omdb" });
  await client.connect();
  const res = await client.query("select * from favourites");
  console.table(res.rows);
  await client.end();
  searchMovies();
}
