import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { prisma } from '$lib/server/services/prisma.service';

export const POST: RequestHandler = async ({ request, params }) => {
	const movieId = Number(params.id);
	if (isNaN(movieId)) throw error(400, 'This movieId is invalid');

	const user = await getAuthenticatedUser(request);

	const movie = await prisma.movie.findUnique({
		where: { id: movieId }
	});
	if (!movie) throw error(404, 'Movie not found');

	const alreadyAdded = await prisma.interested.findFirst({
		where: { userId: user.id, movieId }
	});
	if (alreadyAdded) throw error(400, 'You already have this movie in your watchlist');

	await prisma.interested.create({ data: { userId: user.id, movieId } });

	return json({ message: `${movie.title} has been added to your watchlist.` });
};
