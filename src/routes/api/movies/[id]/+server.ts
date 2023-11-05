import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { prisma } from '$lib/server/services/prisma.service';
import { excludeProperties } from '$lib/server/helpers/object.helper';

export const GET: RequestHandler = async ({ params }) => {
	const movieId = Number(params.id);

	if (isNaN(movieId)) throw error(400, 'This movieId is invalid');

	const movie = await prisma.movie.findUnique({
		where: { id: movieId },
		include: { category: true }
	});
	if (!movie) throw error(404, 'Movie not found');

	return json(excludeProperties(movie, ['content']));
};
