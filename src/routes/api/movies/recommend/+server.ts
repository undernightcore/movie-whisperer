import type { RequestHandler } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { getVectorStore } from '$lib/server/helpers/vector.helper';
import { prisma } from '$lib/server/services/prisma.service';

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search');

	if (!search)
		throw error(400, 'We need to know what you want so we can recommend you great movies!');

	const vector = getVectorStore();

	const movieIds = await vector.similaritySearch(search ?? '', 20);
	const movies = await prisma.movie.findMany({
		where: { id: { in: movieIds.map((movie) => movie.metadata.id) } }
	});

	return json(movies);
};
