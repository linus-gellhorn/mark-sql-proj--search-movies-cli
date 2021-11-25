import { question } from "readline-sync";
import { Client } from "pg";

//As your database is on your local machine, with default port,
//and default username and password,
//we only need to specify the (non-default) database name.

async function searchMovies() {
  const client = new Client({ database: "omdb" });
  console.log("Welcome to search-movies-cli!");
  await client.connect();
  const res = await client.query("SELECT name from movies order by id limit 5");
  console.table(res.rows);
  await client.end();
}

searchMovies();
