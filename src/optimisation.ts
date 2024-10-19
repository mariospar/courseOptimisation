import {
  hasPreference,
  topPreference,
  removePreference,
  getSuccessors,
} from "./entity";
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

import type { Registry, Entity, Optimisation, Matching } from "../types";

/**
 * For each entity, if it is not matched and has an applicant, engage it with the top applicant. If the
 * top applicant is over the threshold, remove the least preferred choice and engage the top applicant
 * with the least preferred choice. If the top applicant is full, remove the least preferred choice and
 * engage the top applicant with the least preferred choice
 *
 * @param {Optimisation}  - entityBook: An array of entities.
 * @returns The matching of the entity book.
 */
export const rothShapleyApplicantOptimal = ({
  applicants: entities,
}: Optimisation): Matching => {
  let freeApplicants = [...entities];

  // Create a registry to track matches and their status
  const registry = createRegistry();

  while (freeApplicants.length > 0) {
    const applicant = freeApplicants.pop()!;
    const preferredCourse = topPreference(applicant);

    if (preferredCourse) {
      engage(registry, applicant, preferredCourse);

      if (isFull(registry, preferredCourse)) {
        const leastPreferred = getLeastPreferredChoice(
          registry,
          preferredCourse
        );
        if (leastPreferred !== null) {
          disengage(registry, leastPreferred, preferredCourse);
          freeApplicants.push(leastPreferred);

          // Remove all successors of the least preferred choice from the course's preferences
          const successors = getSuccessors(preferredCourse, leastPreferred);
          successors.forEach((successor) => {
            removePreference(successor, preferredCourse);
            removePreference(preferredCourse, successor);
          });
        }
      }
    }
  }

  return extractMatching(registry);
};

export const rothShapleyCourseOptimal = ({
  courses: entities,
}: Optimisation): Matching => {
  const optimisation = (_registry: Registry, _entities: Entity[]): void => {
    _entities.forEach((course) => {
      if (
        isUnderSubscribed(_registry, course) &&
        checkAvailable(_registry, course)
      ) {
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
