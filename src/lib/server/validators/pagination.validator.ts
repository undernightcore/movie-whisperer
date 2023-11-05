import { number, object, preprocess } from 'zod';
import { error } from '@sveltejs/kit';
import { ZodError } from 'zod';

const schema = object({
	page: preprocess(
		(value) => Number(value),
		number({ invalid_type_error: 'page should be a number' }).min(1, 'page should be at least 1')
	).default(1),
	perPage: preprocess(
		(value) => Number(value),
		number({ invalid_type_error: 'perPage should be a number' })
			.min(1, 'perPage should be at least 1')
			.max(100, 'You can only request 100 movies at a time')
	).default(20)
});

export function validatePaginationParams(params: unknown) {
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
