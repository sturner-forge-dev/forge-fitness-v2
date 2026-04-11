import type { getExercises } from "./api";

export type Exercise = Awaited<ReturnType<typeof getExercises>>[number];
