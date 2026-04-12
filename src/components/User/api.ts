import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { prisma } from '#/db';

export const syncUser = createServerFn({ method: 'POST' })
	.inputValidator(
		z.object({
			clerkId: z.string(),
			email: z.string(),
			firstName: z.string().optional(),
			lastName: z.string().optional(),
			imageUrl: z.string().optional(),
		}),
	)
	.handler(async ({ data }) => {
		return prisma.user.upsert({
			where: { clerkId: data.clerkId },
			update: {
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
				imageUrl: data.imageUrl,
			},
			create: {
				clerkId: data.clerkId,
				email: data.email,
				firstName: data.firstName,
				lastName: data.lastName,
				imageUrl: data.imageUrl,
			},
		});
	});
