import { api, APIError } from "encore.dev/api";
import { ideaDB } from "./db";
import { validation } from "~encore/clients";
import type { Idea, ValidationResult, TechStackResult, FeaturesResult } from "./types";

// Retrieves a single idea by its ID.
// If analysis has not been run yet, it triggers the analysis,
// stores the results, and then returns the complete idea data.
export const get = api<{ id: string }, Idea>({
  expose: true,
  method: "GET",
  path: "/ideas/:id",
}, async ({ id }) => {
  let idea = await ideaDB.queryRow<Idea>`
    SELECT 
      id, name, original_idea as "originalIdea", enhanced_idea as "enhancedIdea", 
      context, validation_result as "validationResult", 
      tech_stack_result as "techStackResult", features_result as "featuresResult", 
      created_at as "createdAt", updated_at as "updatedAt"
    FROM ideas 
    WHERE id = ${id}
  `;

  if (!idea) {
    throw APIError.notFound("idea not found");
  }

  const analysesToRun: Promise<any>[] = [];

  if (!idea.validationResult) {
    analysesToRun.push(runValidation(id, idea));
  }
  if (!idea.techStackResult) {
    analysesToRun.push(runTechStack(id, idea));
  }
  if (!idea.featuresResult) {
    analysesToRun.push(runFeatures(id, idea));
  }

  if (analysesToRun.length > 0) {
    await Promise.all(analysesToRun);
    // Refetch the idea to get the updated results
    idea = await ideaDB.queryRow<Idea>`
      SELECT 
        id, name, original_idea as "originalIdea", enhanced_idea as "enhancedIdea", 
        context, validation_result as "validationResult", 
        tech_stack_result as "techStackResult", features_result as "featuresResult", 
        created_at as "createdAt", updated_at as "updatedAt"
      FROM ideas 
      WHERE id = ${id}
    `;
    if (!idea) {
      // This should not happen if the idea existed before
      throw APIError.internal("failed to refetch idea after analysis");
    }
  }

  return idea;
});

async function runValidation(id: string, idea: Idea) {
  const result = await validation.validateIdea({
    idea: idea.enhancedIdea || idea.originalIdea,
    industry: idea.context?.industry,
    timeline: idea.context?.timeline,
    budget: idea.context?.budget,
    teamSize: idea.context?.teamSize,
  });
  await ideaDB.exec`
    UPDATE ideas SET validation_result = ${result} WHERE id = ${id}
  `;
}

async function runTechStack(id: string, idea: Idea) {
  const result = await validation.getTechStack({
    idea: idea.enhancedIdea || idea.originalIdea,
    projectType: idea.context?.projectType,
    experience: idea.context?.experience,
    timeline: idea.context?.timeline,
    teamSize: idea.context?.teamSize,
  });
  await ideaDB.exec`
    UPDATE ideas SET tech_stack_result = ${result} WHERE id = ${id}
  `;
}

async function runFeatures(id: string, idea: Idea) {
  const result = await validation.generateFeatures({
    idea: idea.enhancedIdea || idea.originalIdea,
    targetAudience: idea.context?.targetAudience,
    projectType: idea.context?.projectType,
  });
  await ideaDB.exec`
    UPDATE ideas SET features_result = ${result} WHERE id = ${id}
  `;
}
