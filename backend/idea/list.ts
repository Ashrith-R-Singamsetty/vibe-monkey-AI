import { api } from "encore.dev/api";
import { ideaDB } from "./db";
import type { IdeaSummary } from "./types";

interface ListResponse {
  ideas: IdeaSummary[];
}

// Lists all saved startup ideas.
export const list = api<void, ListResponse>({
  expose: true,
  method: "GET",
  path: "/ideas",
}, async () => {
  const ideas = await ideaDB.queryAll<IdeaSummary>`
    SELECT id, name, created_at AS "createdAt" FROM ideas ORDER BY created_at DESC
  `;
  return { ideas };
});
