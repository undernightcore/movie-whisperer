import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { validateRegisterRequest } from '$lib/server/validators/register.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { hashPassword } from '$lib/server/helpers/bcrypt.helper';

export const POST: RequestHandler = async ({ request }) => {
	const { name, email, password } = validateRegisterRequest(await request.json());

	const user = await prisma.user.findUnique({ where: { email } });
	if (user) throw error(400, 'You already have an account');

	const isFirstUser = !(await prisma.user.count());

	await prisma.user.create({
		data: { name, email, password: await hashPassword(password), admin: isFirstUser }
	});

	return json({ message: 'Welcome to Movie Whisper! Please log in!' });
};
