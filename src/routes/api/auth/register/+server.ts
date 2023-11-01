import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { validateRegisterRequest } from '$lib/server/validators/register.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { hashPassword } from '$lib/server/helpers/bcrypt.helper';

export const POST: RequestHandler = async ({ request }) => {
	const alreadyRegistered = Boolean(await prisma.user.count());
	if (alreadyRegistered) throw error(400, 'There is already an admin created');

	const { email, password } = validateRegisterRequest(await request.json());
	await prisma.user.create({ data: { email, password: await hashPassword(password) } });

	return json({ message: 'Admin created successfully' });
};
