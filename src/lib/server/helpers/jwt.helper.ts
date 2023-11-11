import { env } from '$env/dynamic/private';
import type { User } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';
const { sign, verify } = jsonwebtoken;

export function generateUserJwt(user: User) {
	return sign({ userId: user.id }, env.APP_SECRET_KEY);
}

export function getUserIdFromJwt(token: string) {
	try {
		const { userId } = verify(token, env.APP_SECRET_KEY) as { userId: number };
		return userId;
	} catch {
		return null;
	}
}
