import { createServerFn } from "@tanstack/react-start";
import { prisma } from "#/db";

export const getExercises = createServerFn({ method: "GET" }).handler(async () =>
	prisma.exercise.findMany({ orderBy: { name: "asc" } }),
);
