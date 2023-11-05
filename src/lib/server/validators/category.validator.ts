import { number, preprocess } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = preprocess(
	(value) => Number(value),
	number({ invalid_type_error: 'category should be a number' }).optional()
);

export function validateCategoryParam(params: unknown) {
	try {
		return schema.parse(params);
	} catch (e) {
		if (e instanceof ZodError) {
			const errors = e.issues.map((issue) => issue.message);
			throw error(400, { message: errors[0] });
		} else {
			throw error(500, { message: 'Something went wrong' });
		}
	}
}
