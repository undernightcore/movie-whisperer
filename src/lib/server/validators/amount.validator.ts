import { error } from '@sveltejs/kit';
import { ZodError, number, preprocess } from 'zod';

const schema = preprocess(
	(value) => Number(value),
	number({ invalid_type_error: 'amount should be a number' }).min(1, 'amount should be at least 1')
).default(100000);

export function validateAmountParam(value?: string) {
	try {
		return schema.parse(value);
	} catch (e) {
		if (e instanceof ZodError) {
			const errors = e.issues.map((issue) => issue.message);
			throw error(400, { message: errors[0] });
		} else {
			throw error(500, { message: 'Something went wrong' });
		}
	}
}
