import { api } from "encore.dev/api";
import { ideaDB } from "./db";
import { v4 as uuidv4 } from "uuid";

interface CreateRequest {
  name: string;
  originalIdea: string;
  context: any;
}

interface CreateResponse {
  id: string;
}

// Creates a new startup idea entry in the database.
export const create = api<CreateRequest, CreateResponse>({
  expose: true,
  method: "POST",
  path: "/ideas",
}, async (params) => {
  const id = uuidv4();
  await ideaDB.exec`
    INSERT INTO ideas (id, name, original_idea, context)
    VALUES (${id}, ${params.name}, ${params.originalIdea}, ${params.context})
  `;
  return { id };
});
