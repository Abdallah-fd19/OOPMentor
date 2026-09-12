export interface ModuleSummary {
  moduleNumber: number;
  exerciseCount: number;
  completedCount: number;
}

// The API doesn't return titles (see ModuleSummaryResponse.cs) — mapped
// client-side from the curriculum table in CLAUDE.md.
export const MODULE_TITLES: Record<number, string> = {
  1: "Classes & Objects",
  2: "Encapsulation",
  3: "Inheritance",
  4: "Polymorphism",
  5: "Abstraction & Interfaces",
  6: "Composition",
  7: "Capstone Project",
};
