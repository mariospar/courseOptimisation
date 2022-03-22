/**
 * The `Registry` type is a map from entity names to a list of entities.
 *
 * @property {Entity[]} [entity: Entity[]] - An array of entities that are in the registry.
 */
export type Registry = { [entity: string]: Entity[] };

/**
 * The `Matching` type is a map from entity names to a list of matching values.
 *
 * @property {string[]} [entity: string[]] - string[]
 */
export type Matching = { [entity: string]: string[] };

/**
 * The `Optimisation` type is a collection of all courses and applicants with their corresponding
 * preferences.
 *
 * @property {Entity[]} courses - A list of courses that are available to be assigned to applicants.
 * @property {Entity[]} applicants - A list of all the applicants.
 */
export type Optimisation = {
    courses: Entity[];
    applicants: Entity[];
};

/**
 * The `RankTable` type is a map from entity names to their rank.
 *
 * @property {number} [entity: number] - string
 */
export type RankTable = { [entity: string]: number };

/**
 * An `Entity` type can be either a Course or an Applicant.
 *
 * @property {string} name - The name of the entity.
 * @property {Entity[]} preferences - A list of entities that the entity ranks in order of preference.
 * @property {RankTable} rankTable - A rank table is a mapping of ranks to entities.
 * @property {number} capacity - The maximum number of entities that can be assigned to this entity.
 */
export type Entity = {
    name: string;
    preferences: Entity[];
    rankTable: RankTable;
    capacity: number;
};
