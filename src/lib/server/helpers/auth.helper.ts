import { error } from '@sveltejs/kit';
import { getUserIdFromJwt } from './jwt.helper';
import { prisma } from '../services/prisma.service';

export async function getAuthenticatedUser({ headers }: Request) {
	const authHeader = headers.get('Authorization') ?? '';
	const token = authHeader.substring(7);

	if (!token) throw error(401, 'You are not sending authentication token');
	const userId = getUserIdFromJwt(token);
	if (userId === null) throw error(400, 'Invalid token');

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (!user) throw error(400, 'This user does not exist');
	return user;
}
