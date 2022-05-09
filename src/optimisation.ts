import { hasPreference, topPreference, removePreference, getSuccessors } from "./entity";
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
    isUnderSubscribed,
    checkAvailable,
    isElseAssigned,
} from "./registry";

import type { Registry, Entity, Optimisation, Matching } from "./types";

/**
 * For each entity, if it is not matched and has an applicant, engage it with the top applicant. If the
 * top applicant is over the threshold, remove the least preferred choice and engage the top applicant
 * with the least preferred choice. If the top applicant is full, remove the least preferred choice and
 * engage the top applicant with the least preferred choice
 *
 * @param {Optimisation}  - entityBook: An array of entities.
 * @returns The matching of the entity book.
 */
export const rothShapleyApplicantOptimal = ({ applicants: entities }: Optimisation): Matching => {
    const optimisation = (_registry: Registry, _entities: Entity[]): void => {
        _entities.forEach((applicant) => {
            if (isNotMatched(_registry, applicant) && hasPreference(applicant)) {
                const course = topPreference(applicant);
                engage(_registry, applicant, course);
                if (isOverThreshold(_registry, course)) {
                    const leastPreferredChoice = getLeastPreferredChoice(_registry, course);
                    if (leastPreferredChoice !== null) {
                        disengage(_registry, leastPreferredChoice, course);
                    }
                }

                if (isFull(_registry, course)) {
                    const leastPreferredChoice = getLeastPreferredChoice(_registry, course);
                    if (leastPreferredChoice !== null) {
                        const successors = getSuccessors(course, leastPreferredChoice);
                        successors.forEach((successor) => {
                            removePreference(successor, course);
                            removePreference(course, successor);
                        });
                    }
                }
            }
        });

        if (!allAssigned(_registry, _entities)) {
            return optimisation(_registry, _entities);
        }
    };
    const registry = createRegistry();
    optimisation(registry, entities);
    return extractMatching(registry);
};

export const rothShapleyCourseOptimal = ({ courses: entities }: Optimisation): Matching => {
    const optimisation = (_registry: Registry, _entities: Entity[]): void => {
        _entities.forEach((course) => {
            if (isUnderSubscribed(_registry, course) && checkAvailable(_registry, course)) {
                const applicant = topPreference(course);

                if (isElseAssigned(_registry, course, applicant)) {
                    disengage(_registry, course, applicant);
                }
                engage(_registry, course, applicant);

                const successors = getSuccessors(applicant, course);
                successors.forEach((successor) => {
                    removePreference(successor, applicant);
                    removePreference(applicant, successor);
                });
            }
        });
        if (!allAssigned(_registry, _entities)) {
            return optimisation(_registry, _entities);
        }
    };

    const registry = createRegistry();
    optimisation(registry, entities);
    return extractMatching(registry);
};
