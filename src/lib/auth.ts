import { prisma } from '#/db';

export async function getDbUser(clerkId: string) {
	const user = await prisma.user.findUnique({ where: { clerkId } });
	if (!user) throw new Error('User not found');
	return user;
}
