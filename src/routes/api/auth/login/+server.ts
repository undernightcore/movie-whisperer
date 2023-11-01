import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { validateRegisterRequest } from '$lib/server/validators/register.validator';
import { prisma } from '$lib/server/services/prisma.service';
import { isValidPassword } from '$lib/server/helpers/bcrypt.helper';
import { generateUserJwt } from '$lib/server/helpers/jwt.helper';

export const POST: RequestHandler = async ({ request }) => {
	const { email, password } = validateRegisterRequest(await request.json());

	const user = await prisma.user.findUnique({ where: { email } });

	if (!user || !(await isValidPassword(password, user.password)))
		throw error(403, 'These credentials are wrong');

	const token = generateUserJwt(user);

	return json({ token });
};
