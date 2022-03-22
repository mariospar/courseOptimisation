import { hasPreference, topPreference, removePreference, morePreferredOf } from "./entity";
import {
    createRegistry,
    allAssigned,
    isNotMatched,
    engage,
    disengage,
    extractMatching,
    getLeastPreferredChoice,
    isOverThreshold,
    isFull,
} from "./registry";

import type { Registry, Entity, Optimisation, Matching } from "./types";

/*
 * 0. Assign all applicants to be unmatched, and all courses to be totally unsubscribed.
 * 1. Take any unmatched applicant with a non-empty preference list, a, and consider their most
 * 	  preferred course, c. Match them to one another.
 * 2. If, as a result of this new matching, h is now over-subscribed, find the least preferred
 *    applicant currently assigned to c, a'.
 *    Set a' to be unmatched and remove them from the course's matching. Go to 3.
 * 3. If c is at capacity (fully subscribed) then find their worst current match a'.
 *    Then, for each successor, s, to r' in the preference list of c, delete the pair (s, c) from the game. Go to 4.
 * 4. Go to 1 until there are no such applicants left, then end.
 */

/**
 * For each entity, if it is not matched and has an applicant, engage it with the top applicant. If the
 * top applicant is over the threshold, remove the least preferred choice and engage the top applicant
 * with the least preferred choice. If the top applicant is full, remove the least preferred choice and
 * engage the top applicant with the least preferred choice
 *
 * @param {Optimisation}  - entityBook: An array of entities.
 * @returns The matching of the entity book.
 */
export const rothShapley = ({ courses: entityBook }: Optimisation): Matching => {
    const optimisation = (registry: Registry, entities: Entity[]): void => {
        entities.forEach((entity) => {
            if (isNotMatched(registry, entity) && hasPreference(entity)) {
                const candidate = topPreference(entity);
                engage(registry, entity, candidate);
                if (isOverThreshold(registry, candidate)) {
                    const leastPreferredChoice = getLeastPreferredChoice(registry, candidate);
                    if (leastPreferredChoice !== null) {
                        disengage(registry, leastPreferredChoice, candidate);
                    }
                }

                if (isFull(registry, candidate)) {
                    const leastPreferredChoice = getLeastPreferredChoice(registry, candidate);
                    if (leastPreferredChoice !== null) {
                        const successors = morePreferredOf(candidate, leastPreferredChoice);
                        successors.forEach((successor) => {
                            removePreference(successor, candidate);
                            removePreference(candidate, successor);
                        });
                    }
                }
            }
        });

        if (!allAssigned(registry, entities)) {
            return optimisation(registry, entities);
        }
    };
    const registration = createRegistry();
    optimisation(registration, entityBook);
    return extractMatching(registration);
};
