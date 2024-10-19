import { print } from "./entity";
import type { Optimisation } from "../types";

/**
 * Given an optimisation, return a string representation of the courses and applicants
 *
 * @param {Optimisation}  - courses: The courses to optimise.
 */
export const toString = ({
  courses: courses,
  applicants: applicants,
}: Optimisation): { courses: string[]; applicants: string[] } => ({
  courses: courses.map((entity) => print(entity)),
  applicants: applicants.map((entity) => print(entity)),
});
