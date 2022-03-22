import type { Entity } from "./types";

/**
 * Prints out the name of a Course and the names of the people that have been assigned to it
 *
 * @param {Entity}  - name: The name of the Course.
 */
export const print = ({ name, preferences: applicants, capacity }: Entity): string =>
    `${name}${capacity > 1 ? ` (capacity=${capacity})` : ""} prefers: ${applicants
        .map(({ name: nameValue }) => nameValue)
        .join(", ")}`;
/**

 * Create an entity with a name and capacity
 *
 * @param {string} name - the name of the entity, which is a string.
 * @param [capacity=1] - the maximal number of participants to which this Course can be associated with
 */
export const createEntity = (name: string, capacity = 1): Entity => ({
    name,
    preferences: [], // list of preferences
    rankTable: {}, // associate a preference rank to each applicant's id
    capacity, // maximal number of participants to which this Course can be associated with
});

/**
 * Add a preference to an entity's preference list
 *
 * @param {Entity} entity - Entity
 * @param {Entity} preference - The entity that the entity prefers.
 */
export const addPreference = (entity: Entity, preference: Entity): void => {
    entity.preferences.push(preference);
    entity.rankTable[preference.name] = entity.preferences.length - 1;
};

/**
 * Add a list of preferences to an entity
 *
 * @param {Entity} entity - The entity that will be the subject of the preference.
 * @param {Entity[]} preferences - An array of entities that the entity prefers.
 */
export const addPreferences = (entity: Entity, preferences: Entity[]): void => {
    preferences.forEach((preference) => {
        addPreference(entity, preference);
    });
};

/**
 * Remove a preference from an entity
 *
 * @param {Entity} entity - The entity that is being modified.
 * @param {Entity} preference - The entity that the entity is removing a preference for.
 */
export const removePreference = (entity: Entity, preference: Entity): void => {
    const index = entity.preferences.indexOf(preference);
    entity.preferences.splice(index, 1);
    delete entity.rankTable[preference.name];
};

/**
 * Given an entity, return true if it has any preferences.
 *
 * @param {Entity}  - entity: The entity to check for a preference.
 */
export const hasPreference = ({ preferences }: Entity): boolean => preferences.length > 0;

/**
 * Return the first preference of the entity.
 *
 * @param {Entity}  - `preferences`: The preferences to get the top preference from.
 */
export const topPreference = ({ preferences }: Entity): Entity => preferences[0];

/**
 * Given an entity, return the next entity in the list of preferences, or null if there are no more
 * entities.
 *
 * @param {Entity} entity - Entity
 * @returns The most preferred entity.
 */
export const nextPreference = (entity: Entity): Entity | null => {
    const mostPreferredEntity = entity.preferences.shift();
    if (mostPreferredEntity) {
        delete entity.rankTable[mostPreferredEntity.name];
        return mostPreferredEntity;
    }
    return null;
};

/**
 * Given an entity and a preference, return all other preferences in the list of preferences
 *
 * @param {Entity}  - `preferences` is an array of entities.
 * @param {Entity} preference - The entity that is preferred.
 */
export const morePreferredOf = ({ preferences }: Entity, preference: Entity): Entity[] =>
    preferences.slice(1 + preferences.indexOf(preference));

/**
 * Given a rank table and a preference, return the rank of the preference
 *
 * @param {Entity}  - rankTable: A table of ranks for each entity.
 * @param {Entity} preference - The preference entity.
 */
export const rank = ({ rankTable }: Entity, preference: Entity): number =>
    rankTable.hasOwnProperty(preference.name) ? rankTable[preference.name] : Infinity;
