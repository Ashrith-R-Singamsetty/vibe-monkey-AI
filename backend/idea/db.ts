import { SQLDatabase } from "encore.dev/storage/sqldb";

// Create a database named 'idea'
export const ideaDB = new SQLDatabase("idea", {
  migrations: "./migrations",
});
