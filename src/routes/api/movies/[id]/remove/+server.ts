import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { getAuthenticatedUser } from '$lib/server/helpers/auth.helper';
import { prisma } from '$lib/server/services/prisma.service';

export const POST: RequestHandler = async ({ request, params }) => {
	const movieId = Number(params.id);
	if (isNaN(movieId)) throw error(400, 'This movieId is invalid');

	const user = await getAuthenticatedUser(request);

	const movieInWatchlist = await prisma.interested.findFirst({
		where: { userId: user.id, movieId }
	});
	if (!movieInWatchlist) throw error(400, 'You do not have this movie in your watchlist');

	const movie = await prisma.movie.findUnique({
		where: { id: movieId }
	});
	if (!movie) throw error(404, 'Movie not found');

	await prisma.interested.delete({ where: { id: movieInWatchlist.id } });

	return json({ message: `${movie.title} has been removed from your watchlist.` });
};
