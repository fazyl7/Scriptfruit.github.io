import type { Course } from "../utils/types";
export const mockCourses: Course[] = [
  { id: "c1", name: "Mathematics I", attended: 10, total: 12 },
  { id: "c2", name: "Engineering Physics", attended: 8, total: 12 },
  { id: "c3", name: "Engineering Chemistry", attended: 9, total: 12 },
];
export type CourseCatalog = {
  [branch: string]: {
    [semester: string]: Course[];
  };
};

export const courseCatalog: CourseCatalog = {
  ME: {
    "First Year-Group A": [
      { id: "me-fy-a1", name: "Engineering Physics", attended: 10, total: 12 },
      { id: "me-fy-a2", name: "Engineering Chemistry", attended: 9, total: 12 },
    ],
    "First Year-Group B": [
      { id: "me-fy-b1", name: "Basic Electrical", attended: 11, total: 12 },
      { id: "me-fy-b2", name: "Engineering Graphics", attended: 8, total: 12 },
    ],
    "3": [
      { id: "me3-1", name: "Mechanics of Materials", attended: 30, total: 40 },
      { id: "me3-2", name: "Thermodynamics", attended: 26, total: 35 },
    ],
    "4": [
      { id: "me4-1", name: "Fluid Mechanics", attended: 18, total: 25 },
    ],
      // ... add till 8th sem
    },
    // You can add more branches here if needed
  };

