import { rank, hasPreference } from "./entity";
/*
 * A Registry stores the list of applicants who have been accepted in a BEST Course
 */

import type { Registry, Entity, Matching } from "../types";

/**
 * Create an empty registry
 */
export const createRegistry = (): Registry => ({});

/**
 * It adds the applicant to the course's registry and the course to the applicant's registry.
 *
 * @param {Registry} registry - Registry
 * @param {Entity} course - Entity
 * @param {Entity} applicant - The applicant who is applying to the course.
 */
export const engage = (
  registry: Registry,
  course: Entity,
  applicant: Entity
): void => {
  if (!registry[course.name]) registry[course.name] = [];
  if (!registry[applicant.name]) registry[applicant.name] = [];

  registry[course.name].push(applicant);
  registry[applicant.name].push(course);
};

/**
 * Remove the applicant from the course and remove the course from the applicant's list of courses
 *
 * @param {Registry} registry - Registry
 * @param {Entity} course - The course that the applicant is applying to.
 * @param {Entity} applicant - The applicant who is disengaging from the course.
 */
export const disengage = (
  registry: Registry,
  course: Entity,
  applicant: Entity
): void => {
  registry[course.name] =
    registry[course.name]?.filter((a) => a.name !== applicant.name) || [];
  registry[applicant.name] =
    registry[applicant.name]?.filter((c) => c.name !== course.name) || [];
};

/**
 * Removes the applicant from the given courses's preference list and removes the course from the
 * applicant's preference list.
 *
 * @param {Entity} course - The course entity.
 * @param {Entity} applicant - The applicant entity.
 */
export const deletePair = (course: Entity, applicant: Entity): void => {
  // Remove applicant from courses's preference list
  course.preferences = course.preferences.filter(
    (pref) => pref.name !== applicant.name
  );
  delete course.rankTable[applicant.name];

  // Remove course from applicant's preference list
  applicant.preferences = applicant.preferences.filter(
    (pref) => pref.name !== course.name
  );
  delete applicant.rankTable[course.name];
};

/**
 * Return the number of entities in the registry that match the given entity.
 *
 * @param {Registry} registry - the registry of entities
 * @param {Entity} entity - The entity to be matched.
 */
const numberOfMatches = (registry: Registry, entity: Entity): number =>
  registry[entity.name] ? registry[entity.name].length : 0;

/**
 * Is the number of matches for the given entity greater than the entity's capacity?
 *
 * @param {Registry} registry - the registry of entities
 * @param {Entity} entity - The entity that we're checking.
 */
export const isOverThreshold = (registry: Registry, entity: Entity): boolean =>
  numberOfMatches(registry, entity) > entity.capacity;

/**
 * Is the entity full?
 *
 * @param {Registry} registry - The registry that contains the entity.
 * @param {Entity} entity - The entity to check.
 */
export const isFull = (registry: Registry, entity: Entity): boolean =>
  (registry[entity.name]?.length || 0) >= entity.capacity;

/**
 * Check if a course is willing and able to take an applicant.
 *
 * @param {Registry} registry - The current matchings.
 * @param {Entity} course - The course entity.
 * @returns {boolean} - True if the course can still take an unmatched applicant.
 */
export const checkAvailable = (
  registry: Registry,
  course: Entity
): boolean => {
  // Check if the course has remaining capacity
  if (course.capacity <= (registry[course.name]?.length || 0)) {
    return false;
  }

  // Check if there are still unmatched applicants in its preference list
  const unmatchedApplicants = course.preferences.filter(
    (applicant) => !registry[course.name]?.includes(applicant)
  );

  return unmatchedApplicants.length > 0;
};

/**
 * Returns true if the entity does not match any of the patterns in the registry
 *
 * @param {Registry} registry - The registry to check against.
 * @param {Entity} entity - The entity to check.
 */
export const isNotMatched = (registry: Registry, entity: Entity): boolean =>
  !registry[entity.name]?.length;

/**
 * Is the number of matches less than the capacity of the entity?
 *
 * @param {Registry} registry - The registry that contains the entity.
 * @param {Entity} entity - The entity we're checking.
 */
export const isUnderSubscribed = (
  registry: Registry,
  entity: Entity
): boolean => numberOfMatches(registry, entity) < entity.capacity;

/**
 * Given an entity, return the current match in the registry
 *
 * @param {Registry} registry - The registry that contains the entities.
 * @param {Entity} entity - The entity to check.
 */
export const currentMatch = (
  registry: Registry,
  entity: Entity
): Entity | null =>
  registry[entity.name] && registry[entity.name].length > 0 ? registry[entity.name][0] : null;

/**
 * Find the least preferred choice for an entity
 *
 * @param {Registry} registry - The registry of all entities in the system.
 * @param {Entity} entity - The entity that is being matched.
 * @returns The least preferred choice.
 */
export const getLeastPreferredChoice = (
  registry: Registry,
  entity: Entity
): Entity => {
  const currentEntities = registry[entity.name];

  // Initialize leastPreferred to the first entity in the list
  let leastPreferred: Entity = currentEntities[0];
  let maxRank = entity.rankTable[leastPreferred.name];

  // Loop through all matched entities to find the least preferred one
  currentEntities.forEach((applicant) => {
    const rank = entity.rankTable[applicant.name];
    if (rank > maxRank) {
      maxRank = rank;
      leastPreferred = applicant;
    }
  });

  return leastPreferred;
};

/**
 * Given a registry and a list of entities, return true if all entities are assigned to the registry
 *
 * @param {Registry} registry - Registry
 * @param {Entity[]} entities - The list of entities to check.
 * @returns A boolean value.
 */
export const allAssigned = (
  registry: Registry,
  entities: Entity[]
): boolean => {
  const unassignedApplicants = entities.filter(
    (entity) => isNotMatched(registry, entity) && hasPreference(entity)
  );
  return unassignedApplicants.length === 0;
};

/**
 * Given a registry and a course, return true if the applicant has been assigned to a different course
 *
 * @param {Registry} registry - The registry that keeps all current matches
 * @param {Entity} course - The course that the applicant is applying for.
 * @param {Entity} applicant - the applicant we're checking for
 */
export const isElseAssigned = (
  registry: Registry,
  course: Entity,
  applicant: Entity
): boolean => {
  return currentMatch(registry, applicant)?.name !== course.name;
};

/**
 * Given a registry, return a mapping of applicant names to the names of the courses they are matched with.
 *
 * @param {Registry} registry - The registry that stores the current matches.
 * @returns A dictionary of applicant names to lists of course names they are matched with.
 */
export const extractMatching = (registry: Registry): Matching => {
  const matching: Matching = {};

  Object.keys(registry).forEach((entityName) => {
    const matches = registry[entityName];

    if (matches[0]?.capacity === 1) {
      // If it's an applicant, map the entityName to the names of its matches (the courses it is assigned to)
      matching[entityName] = matches.map((entity) => entity.name);
    }
  });

  return matching;
};
