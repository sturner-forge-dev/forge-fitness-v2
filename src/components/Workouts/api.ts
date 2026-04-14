import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { getDbUser } from '#/lib/auth';
import { prisma } from '#/db';

const SetSchema = z.object({
	setNumber: z.number().int().min(1),
	reps: z.number().int().min(0).optional(),
	weight: z.number().min(0).optional(),
	durationSeconds: z.number().int().min(0).optional(),
	isWarmup: z.boolean().default(false),
	rpe: z.number().int().min(1).max(10).optional(),
});

const WorkoutExerciseSchema = z.object({
	exerciseId: z.number().int(),
	order: z.number().int(),
	notes: z.string().optional(),
	sets: z.array(SetSchema).min(1),
});

const CreateWorkoutSchema = z.object({
	clerkId: z.string(),
	name: z.string().optional(),
	notes: z.string().optional(),
	startedAt: z.string().datetime(),
	completedAt: z.string().datetime().optional(),
	exercises: z.array(WorkoutExerciseSchema).min(1),
});

export const createWorkoutSession = createServerFn({ method: 'POST' })
	.inputValidator(CreateWorkoutSchema)
	.handler(async ({ data }) => {
		const user = await getDbUser(data.clerkId);

		return prisma.$transaction(async (tx) => {
			return tx.workoutSession.create({
				data: {
					userId: user.id,
					name: data.name,
					notes: data.notes,
					startedAt: new Date(data.startedAt),
					completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
					exercises: {
						create: data.exercises.map((ex) => ({
							exerciseId: ex.exerciseId,
							order: ex.order,
							notes: ex.notes,
							sets: {
								create: ex.sets.map((set) => ({
									setNumber: set.setNumber,
									reps: set.reps,
									weight: set.weight,
									durationSeconds: set.durationSeconds,
									isWarmup: set.isWarmup,
									rpe: set.rpe,
								})),
							},
						})),
					},
				},
				include: { exercises: { include: { sets: true } } },
			});
		});
	});

export const getWorkoutSessions = createServerFn({ method: 'GET' })
	.inputValidator(z.object({ clerkId: z.string() }))
	.handler(async ({ data }) => {
		const user = await getDbUser(data.clerkId);

		return prisma.workoutSession.findMany({
			where: { userId: user.id },
			orderBy: { startedAt: 'desc' },
			include: {
				_count: { select: { exercises: true } },
				exercises: {
					include: { _count: { select: { sets: true } } },
				},
			},
		});
	});
