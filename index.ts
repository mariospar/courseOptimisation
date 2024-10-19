/* Solving the problem using the Roth-Shapley algorithm. */
import { addPreferences, createEntity } from "./src/entity";
import { rothShapleyApplicantOptimal } from "./src/optimisation";
import type { Optimisation } from "./types";
import { toString } from "./src/problem";

export const createBestCourseOptimisationProblem = (): Optimisation => {
  const applicantNames = ["A", "S", "D", "L", "J"];
  const courseNames = ["M", "C", "G"];

  const applicants = applicantNames.map((applicant) => createEntity(applicant));
  const courses = courseNames.map((course) => createEntity(course, 2));

  addPreferences(applicants[0], [courses[1]]);
  addPreferences(applicants[1], [courses[1], courses[0]]);
  addPreferences(applicants[2], [courses[1], courses[0], courses[2]]);
  addPreferences(applicants[4], [courses[1], courses[2], courses[0]]);
  addPreferences(applicants[3], [courses[0], courses[1], courses[2]]);

  addPreferences(courses[0], [
    applicants[2],
    applicants[3],
    applicants[1],
    applicants[4],
  ]);
  addPreferences(courses[1], [
    applicants[2],
    applicants[0],
    applicants[1],
    applicants[3],
    applicants[4],
  ]);
  addPreferences(courses[2], [applicants[2], applicants[4], applicants[3]]);
  return { courses, applicants };
};

/**
 * Given a problem, solve it using the Roth-Shapley algorithm
 */
export const runBestCourseOptimisationProblem = (): void => {
  const applicantsCoursesProblem = createBestCourseOptimisationProblem();
  console.log("Applicant-Course problem: ", toString(applicantsCoursesProblem));
  const applicantsCoursesResult = rothShapleyApplicantOptimal(
    applicantsCoursesProblem
  );
  console.log("Solution", applicantsCoursesResult);
};

runBestCourseOptimisationProblem();
