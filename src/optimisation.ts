import { topPreference, getSuccessors } from "./entity";
import {
  createRegistry,
  engage,
  disengage,
  extractMatching,
  getLeastPreferredChoice,
  isFull,
  checkAvailable,
  isElseAssigned,
  deletePair,
  currentMatch,
} from "./registry";

import type { Optimisation, Matching } from "../types";

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
  applicants,
}: Optimisation): Matching => {
  const registry = {};

  // Keep track of free applicants that still need to be matched
  let freeApplicants = [...applicants];

  while (freeApplicants.length > 0) {
    const applicant = freeApplicants.pop()!;

    // Get the top preference of the applicant
    const preferredCourse = topPreference(applicant);

    // Check if the course is full
    if (isFull(registry, preferredCourse)) {
      // If so, find the least preferred applicant in the course
      const leastPreferred = getLeastPreferredChoice(registry, preferredCourse);

      // Remove the least preferred applicant from the course
      disengage(registry, preferredCourse, leastPreferred);

      // Add the removed applicant back to the free pool to reattempt matching
      freeApplicants.push(leastPreferred);
    }

    // Engage applicant with their top choice course
    engage(registry, preferredCourse, applicant);

    // If the course is full, remove successors of the least preferred match
    if (isFull(registry, preferredCourse)) {
      const leastPreferred = getLeastPreferredChoice(registry, preferredCourse);
      const successors = getSuccessors(preferredCourse, leastPreferred);

      successors.forEach((successor) => {
        // Remove successors from the course's preference list
        disengage(registry, preferredCourse, successor);
        deletePair(preferredCourse, successor);
        // If a successor is free, remove them from the free pool
        if (
          !successor.preferences.length &&
          freeApplicants.includes(successor)
        ) {
          freeApplicants = freeApplicants.filter((app) => app !== successor);
        }
      });
    }
  }

  return extractMatching(registry);
};

export const rothShapleyCourseOptimal = ({
  courses,
}: Optimisation): Matching => {
  const registry = createRegistry();

  // Keep track of unmatched courses
  let freeCourses = [...courses];

  while (freeCourses.length > 0) {
    const course = freeCourses.pop()!;

    // Get the courses's most preferred applicant that is not yet matched to it
    const preferredApplicant = topPreference(course);

    // If the applicant is currently matched, unmatch them
    const currentMatchedCourse = currentMatch(registry, preferredApplicant);

    if (currentMatchedCourse && currentMatchedCourse.name !== course.name) {
      disengage(registry, currentMatchedCourse, preferredApplicant);
      // Add the unmatched course back to free courses if it's now undersubscribed
      if (!freeCourses.includes(currentMatchedCourse)) {
        freeCourses.push(currentMatchedCourse);
      }
      // Match the course with its preferred applicant
      engage(registry, course, preferredApplicant);
    }

    // Check if the course is still undersubscribed
    if (
      checkAvailable(registry, course) &&
      !freeCourses.includes(course)
    ) {
      freeCourses.push(course);
    }

    // Remove the successors of the current applicant for the given course
    const successors = getSuccessors(preferredApplicant, course);
    successors.forEach((successor) => {
      deletePair(successor, preferredApplicant);
      if (
        !checkAvailable(registry, successor) &&
        freeCourses.includes(successor)
      ) {
        freeCourses = freeCourses.filter(
          (course) => course !== successor
        );
      }
    });
  }

  return extractMatching(registry);
};
