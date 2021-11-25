import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

async function searchMovies() {
  const client = new Client({ database: "omdb" });
  console.log("Welcome to search-movies-cli!");
  await client.connect();

  let searchTerm;
  while (searchTerm !== "q") {
    searchTerm = question(`Search for what movie? (or 'q' to quit): `);
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

searchMovies();

// query
// select id, name, date, runtime, budget, revenue, vote_average, votes_count
// from movies
// where kind = 'movie'
// and name ilike '%Fantastic%'
// order by date desc
// limit 10;

// need to make case insensitive - SOLUTION: use ILIKE instead of LIKE
