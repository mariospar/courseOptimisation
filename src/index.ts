import { addPreferences, createEntity } from "./entity";
/* Solving the problem using the Roth-Shapley algorithm. */
import { rothShapleyCourseOptimal, rothShapleyApplicantOptimal } from "./optimisation";
import type { Optimisation } from "./types";
import { toString } from "./problem";


export const createBestCourseOptimisationProblem = (
    numberOfResidents: number,
    hospitalsCapacities: number[],
): Optimisation => {
    const applicants = Array.from({ length: numberOfResidents }, (v, residentNumber) =>
        createEntity(`Resident-${residentNumber}`),
    );
    const courses = hospitalsCapacities.map((capacity, hospitalNumber) =>
        createEntity(`Hospital number ${hospitalNumber}`, capacity),
    );

    applicants.forEach((resident) => {
        addPreferences(resident, courses);
    });

    const reversedResidents = applicants.slice().reverse();
    courses.forEach((hospital) => {
        addPreferences(hospital, reversedResidents);
    });

    return { courses, applicants };
};

// const createProblem2301 = (): Optimisation => {
//     const applicants = Array.from({ length: 4 }, (v, i) => createEntity(`Student${i}`));
//     const courses = Array.from({ length: 4 }, (v, i) => createEntity(`Corrector${i}`));

//     addPreferences(applicants[0], [courses[0], courses[1], courses[2], courses[3]]);
//     addPreferences(applicants[1], [courses[0], courses[3], courses[2], courses[1]]);
//     addPreferences(applicants[2], [courses[1], courses[0], courses[2], courses[3]]);
//     addPreferences(applicants[3], [courses[3], courses[1], courses[2], courses[0]]);

//     addPreferences(courses[0], [applicants[3], applicants[2], applicants[0], applicants[1]]);
//     addPreferences(courses[1], [applicants[1], applicants[3], applicants[0], applicants[2]]);
//     addPreferences(courses[2], [applicants[3], applicants[0], applicants[1], applicants[2]]);
//     addPreferences(courses[3], [applicants[2], applicants[1], applicants[0], applicants[3]]);
//     return { courses, applicants };
// };

// const createProblem2302 = (): Optimisation => {
//     const residents = ["A", "S", "D", "J", "L"]
//     const hospitals = ["M", "C", "G"]

//     const applicants = residents.map((resident) => createEntity(resident));
//     const courses = hospitals.map((hospital) => createEntity(hospital, 2));

//     addPreferences(applicants[0], [courses[1]]);
//     addPreferences(applicants[1], [courses[1], courses[0]]);
//     addPreferences(applicants[2], [courses[1], courses[0], courses[2]]);
//     addPreferences(applicants[3], [courses[1], courses[2], courses[0]]);
//     addPreferences(applicants[4], [courses[0], courses[1], courses[2]]);

//     addPreferences(courses[0], [applicants[2], applicants[4], applicants[1], applicants[3]]);
//     addPreferences(courses[1], [applicants[2], applicants[0], applicants[1], applicants[4], applicants[3]]);
//     addPreferences(courses[1], [applicants[2], applicants[3], applicants[4]]);
//     return { courses, applicants };
// };

const createProblem2303 = (): Optimisation => {
    const residents = ["A", "S", "D", "L", "J"];
    const hospitals = ["M", "C", "G"];

    const applicants = residents.map((resident) => createEntity(resident));
    const courses = hospitals.map((hospital) => createEntity(hospital, 2));

    addPreferences(applicants[0], [courses[1]]);
    addPreferences(applicants[1], [courses[1], courses[0]]);
    addPreferences(applicants[2], [courses[1], courses[0], courses[2]]);
    addPreferences(applicants[4], [courses[1], courses[2], courses[0]]);
    addPreferences(applicants[3], [courses[0], courses[1], courses[2]]);

    addPreferences(courses[0], [applicants[2], applicants[3], applicants[1], applicants[4]]);
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

const problem = createProblem2303();
const result = rothShapleyCourseOptimal(problem);
// const result = rothShapleyApplicantOptimal(problem);

console.log(result)

/**
 * Given a problem, solve it using the Roth-Shapley algorithm
 */
export const runBestCourseOptimisationProblem = (): void => {
    const applicantsCoursesProblem = createBestCourseOptimisationProblem(10, [3, 3, 4]);
    console.log("Applicant-Course problem: ", toString(applicantsCoursesProblem));
    const applicantsCoursesResult = rothShapleyCourseOptimal(applicantsCoursesProblem);
    console.log("Solution", applicantsCoursesResult);
};

// runBestCourseOptimisationProblem();
