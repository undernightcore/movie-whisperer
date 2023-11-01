import { APP_SECRET_KEY } from '$env/static/private';
import type { User } from '@prisma/client';
import { sign, verify } from 'jsonwebtoken';

export function generateUserJwt(user: User) {
	return sign({ userId: user.id }, APP_SECRET_KEY);
}

export function getUserIdFromJwt(token: string) {
	try {
		const { userId } = verify(token, APP_SECRET_KEY) as { userId: number };
		return userId;
	} catch {
		return null;
	}
}
