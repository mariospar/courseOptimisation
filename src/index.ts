import { rothShapley } from "./optimisation";
import { addPreferences, createEntity } from "./entity";
import { toString } from "./problem";
import type { Optimisation } from "./types";

/**
 * Create a problem where each applicant is a course and each course has a number of applicants
 *
 * @param {number} numberOfApplicants - The number of applicants to create.
 * @param {number[]} courseCapacities - An array of the capacities of each course.
 * @returns The optimisation problem.
 */
export const createBestCourseOptimisationProblem = (
    numberOfApplicants: number,
    courseCapacities: number[],
): Optimisation => {
    const applicants = Array.from({ length: numberOfApplicants }, (v, applicantNumber) =>
        createEntity(`Applicant ID - ${applicantNumber}`),
    );

    const courses = courseCapacities.map((capacity, courseNumber) =>
        createEntity(`Course ID - ${courseNumber}`, capacity),
    );

    applicants.forEach((applicant) => {
        addPreferences(applicant, courses);
    });

    const reversedApplicants = applicants.slice().reverse();
    courses.forEach((course) => {
        addPreferences(course, reversedApplicants);
    });

    return { courses, applicants };
};

const createProblem2301 = (): Optimisation => {
    const applicants = Array.from({ length: 4 }, (v, i) => createEntity(`Student${i}`));
    const courses = Array.from({ length: 4 }, (v, i) => createEntity(`Corrector${i}`));

    addPreferences(applicants[0], [courses[0], courses[1], courses[2], courses[3]]);
    addPreferences(applicants[1], [courses[0], courses[3], courses[2], courses[1]]);
    addPreferences(applicants[2], [courses[1], courses[0], courses[2], courses[3]]);
    addPreferences(applicants[3], [courses[3], courses[1], courses[2], courses[0]]);

    addPreferences(courses[0], [applicants[3], applicants[2], applicants[0], applicants[1]]);
    addPreferences(courses[1], [applicants[1], applicants[3], applicants[0], applicants[2]]);
    addPreferences(courses[2], [applicants[3], applicants[0], applicants[1], applicants[2]]);
    addPreferences(courses[3], [applicants[2], applicants[1], applicants[0], applicants[3]]);
    return { courses, applicants };
};

const problem = createProblem2301();
const result = rothShapley(problem);

console.log(result);

/**
 * Given a problem, solve it using the Roth-Shapley algorithm
 */
export const runBestCourseOptimisationProblem = (): void => {
    const applicantsCoursesProblem = createBestCourseOptimisationProblem(10, [3, 3, 3]);
    console.log("Applicant-Course problem: ", toString(applicantsCoursesProblem));
    const applicantsCoursesResult = rothShapley(applicantsCoursesProblem);
    console.log("Solution", applicantsCoursesResult);
};

// runBestCourseOptimisationProblem();
