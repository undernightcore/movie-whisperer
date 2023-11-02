import { object, string } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = object({
	name: string({ required_error: 'A name is required' }),
	email: string({ required_error: 'An email is required' }).email({
		message: 'This email is invalid'
	}),
	password: string({ required_error: 'A password is required' })
});

export function validateRegisterRequest(body: unknown) {
	try {
		return schema.parse(body);
	} catch (e) {
		if (e instanceof ZodError) {
			const errors = e.issues.map((issue) => issue.message);
			throw error(400, { message: errors[0] });
		} else {
			throw error(500, { message: 'Something went wrong' });
		}
	}
}
