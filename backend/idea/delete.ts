import { api } from "encore.dev/api";
import { ideaDB } from "./db";

// Deletes an idea from the database.
export const del = api<{ id: string }, void>({
  expose: true,
  method: "DELETE",
  path: "/ideas/:id",
}, async ({ id }) => {
  await ideaDB.exec`DELETE FROM ideas WHERE id = ${id}`;
});
