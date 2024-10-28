# BEST Course Optimisation

## Abstract
The BEST (Board of European Students of Technology) organization allocates participants to academic courses through a centralized matching process. Previously, this allocation used the Hungarian algorithm, which, despite its effectiveness, faced computational inefficiencies when scaling to thousands of applications. To address this, we propose an optimized matching algorithm inspired by the Stable Marriage problem and adapted for capacity constraints, akin to the **Hospital-Residents (HR)** model.

In large-scale matching systems, balancing the preferences of individuals with constraints such as course capacities is a recognized challenge in both economics and game theory. BEST’s course allocation problem parallels the HR problem, where participants (applicants) are matched to courses with fixed capacities, mirroring hospitals matching residents. We adapt the **Gale-Shapley algorithm** to optimize this allocation process, aiming to reduce the time complexity from $O(n^3)$ to $O(mn)$ where $m$ is the number of BEST Courses.

## The Algorithms
This repository includes both **applicant-optimal** and **course-optimal** versions of the algorithm, each tailored to distinct objectives and based on preference and capacity constraints:

### Applicant-Optimal Algorithm
This approach is driven by applicants' preferences, leading to stable outcomes where each applicant is matched to the best possible course that would accept them. In effect, this algorithm minimizes unfulfilled preferences among applicants, leading to enhanced participant satisfaction.

```
1. Assign each applicant to be free.
2. Assign each course as totally undersubscribed.
3. While there exists an applicant with unproposed courses:
    a. Select the applicant’s highest-ranked course.
    b. Provisionally match the applicant to this course.
    c. If the course exceeds capacity:
        i. Identify and unmatch the least-preferred applicant.
    d. If the course is full:
        i. Remove all lower-ranked applicants from its preference list.
4. Repeat until no applicants have unproposed courses.
```

This algorithm guarantees that no applicant can be better off by switching to another course, thus achieving an **applicant-optimal stable matching**.

### Course-Optimal Algorithm
In contrast, the course-optimal algorithm prioritizes courses’ preferences, ensuring that each course is matched with the most desirable applicants. This is especially valuable in situations with high competition for spots, as it provides organizing teams greater control over participant selection.

```
1. Assign each applicant to be free.
2. Assign each course as totally undersubscribed.
3. While a course is undersubscribed and has unmatched applicants:
    a. The course proposes to its highest-ranked unmatched applicant.
    b. If the applicant is already matched:
        i. Unmatch them from their current course.
    c. The applicant matches with the new course.
    d. Remove lower-ranked courses from the applicant’s preference list.
4. Repeat until courses have reached capacity or all applicants are matched.
```

The resulting **course-optimal stable matching** aligns with each course’s top preferences, given the constraints, thus maximizing the desirability of course assignments from the organizers’ perspective.

### Stability and Comparison
Both algorithms are designed to produce stable matchings, a state in which no applicant-course pair would prefer to be matched with each other over their current assignments. This stability is crucial in ensuring fairness and preventing “blocking pairs,” where an applicant and course might have incentive to deviate from their assigned matches.

|    Aspect    |         Applicant-Optimal Algorithm         |         Course-Optimal Algorithm         |
|:------------:|:-------------------------------------------:|:----------------------------------------:|
| Optimality   | Prioritizes applicants' preferences         | Prioritizes courses' preferences         |
| Satisfaction | Higher applicant satisfaction               | Higher course organizer satisfaction     |
| Stability    | Ensures a stable, applicant-preferred match | Ensures a stable, course-preferred match |


## Theoretical Foundations
The underlying structure of this work is rooted in the Gale-Shapley algorithm, applied to a modified Stable Marriage problem with capacities. This problem, also known as the Hospital-Residents model, allows for flexible course capacities, optimizing match quality by balancing mutual preferences and ensuring stability across all assignments.

## References
1. Gale, D., & Shapley, L.S. "College Admissions and the Stability of Marriage." The American Mathematical Monthly, 1962.
2. Roth, A.E. "The Evolution of the Labor Market for Medical Interns and Residents: A Case Study in Game Theory." Journal of Political Economy, 1984.

## Usage

### Prerequisites
* [Bun](https://bun.sh/) runtime: Ensure you have Bun installed. Bun serves as the runtime environment for this TypeScript project.
* Run the package installation with `bun install`

### Usage

The can create a new problem in the format that its been used in `index.ts` and choose which of the 2 algorithms you want to use, in the same file.

Then just run:

```sh
bun run dev
```




