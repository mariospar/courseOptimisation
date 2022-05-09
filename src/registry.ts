import { rank, hasPreference } from "./entity";
/*
 * A Registry stores the list of applicants who have been accepted in a BEST Course
 */

import type { Registry, Entity, Matching } from "./types";

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
export const engage = (registry: Registry, course: Entity, applicant: Entity): void => {
    if (!registry.hasOwnProperty(course.name)) {
        registry[course.name] = [];
    }
    if (!registry.hasOwnProperty(applicant.name)) {
        registry[applicant.name] = [];
    }

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
export const disengage = (registry: Registry, course: Entity, applicant: Entity): void => {
    const indexOfApplicant = registry[course.name]?.indexOf(applicant);
    const indexOfCourse = registry[applicant.name]?.indexOf(course);

    registry[course.name]?.splice(indexOfApplicant, 1);
    registry[applicant.name]?.splice(indexOfCourse, 1);
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
    numberOfMatches(registry, entity) === entity.capacity;

/**
 * Is there a preference of them that they are not currently assigned to?
 *
 * @param {Registry} registry - Registry
 * @param {Entity} entity - The entity that is being checked.
 */
export const checkAvailable = (registry: Registry, entity: Entity): boolean =>
    entity.preferences.some((preference) => !registry[entity.name]?.includes(preference))

/**
 * Returns true if the entity does not match any of the patterns in the registry
 *
 * @param {Registry} registry - The registry to check against.
 * @param {Entity} entity - The entity to check.
 */
export const isNotMatched = (registry: Registry, entity: Entity): boolean =>
    numberOfMatches(registry, entity) === 0;

/**
 * Is the number of matches less than the capacity of the entity?
 *
 * @param {Registry} registry - The registry that contains the entity.
 * @param {Entity} entity - The entity we're checking.
 */
export const isUnderSubscribed = (registry: Registry, entity: Entity): boolean =>
    numberOfMatches(registry, entity) < entity.capacity;

/**
 * Given an entity, return the current match in the registry
 *
 * @param {Registry} registry - The registry that contains the entities.
 * @param {Entity} entity - The entity to check.
 */
export const currentMatch = (registry: Registry, entity: Entity): Entity | null =>
    numberOfMatches(registry, entity) > 0 ? registry[entity.name][0] : null;

/**
 * Find the least preferred choice for an entity
 *
 * @param {Registry} registry - The registry of all entities in the system.
 * @param {Entity} entity - The entity that is being matched.
 * @returns The least preferred choice.
 */
export const getLeastPreferredChoice = (registry: Registry, entity: Entity): Entity | null => {
    if (isNotMatched(registry, entity)) {
        return null;
    }

    let max = -1;
    let worst = null;
    registry[entity.name].forEach((applicant) => {
        const rankNumber = rank(entity, applicant);
        if (rankNumber > max) {
            max = rankNumber;
            worst = applicant;
        }
    });
    return worst;
};

/**
 * Given a registry and a list of entities, return true if all entities are assigned to the registry
 *
 * @param {Registry} registry - Registry
 * @param {Entity[]} entities - The list of entities to check.
 * @returns A boolean value.
 */
export const allAssigned = (registry: Registry, entities: Entity[]): boolean => {
    const unassignedApplicants = entities.filter(
        (entity) => isNotMatched(registry, entity) && hasPreference(entity),
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
export const isElseAssigned = (registry: Registry, course: Entity, applicant: Entity): boolean => {
    return currentMatch(registry, applicant)?.name !== course.name;
};

/**
 * Given a registry, return a mapping of registry names to the names of entities in the registry
 *
 * @param {Registry} registry - Registry
 * @returns A dictionary of entity names to lists of matching entity names.
 */
export const extractMatching = (registry: Registry): Matching => {
    const names = Object.keys(registry);
    return names.reduce((acc: Matching, name: string) => {
        acc[name] = registry[name].map((entity) => entity.name);
        return acc;
    }, {});
};
