import type { RequestHandler } from '@sveltejs/kit';
import { tmdb } from '$lib/server/services/tmdb.service';
import { prisma } from '$lib/server/services/prisma.service';
import { json } from '@sveltejs/kit';
import { getVectorStore } from '$lib/server/helpers/vector.helper';
import { VectorMovieModel } from '$lib/server/models/vector-movie.model';

export const POST: RequestHandler = async () => {
	await processCategories();
	await processMovies();
	return json({ message: 'Surprising lol' });
};

async function processCategories() {
	console.info('Categories\n----------');

	const localCategories = await prisma.category
		.findMany()
		.then((categories) => categories.map((category) => category.id));

	console.info(`${localCategories.length} categories found in local DB`);
	console.info('Fetching new categories from TMDB...');

	const remoteCategories = await tmdb
		.getCategories()
		.then((categories) =>
			categories
				.filter((category) => !localCategories.includes(category.id))
				.map(({ id, name }) => ({ id, title: name }))
		);

	console.info(`${remoteCategories.length} new categories have been saved\n`);

	await prisma.category.createMany({ data: remoteCategories });
}

async function processMovies() {
	console.info('Movies\n----------');

	const localMovies = await prisma.movie
		.findMany({ select: { id: true } })
		.then((ids) => ids.map(({ id }) => id));

	console.info(`${localMovies.length} are already processed in your local DB`);

	const movies = await tmdb
		.getAllMovieIds()
		.then((ids) => ids.filter((id) => !localMovies.includes(id)));

	console.info(`You still have ${movies.length} movies waiting to be processed`);

	const vector = getVectorStore();

	while (movies.length) {
		const moviesToProcess = movies.splice(0, 10);

		const fetchingMovies = await Promise.all(
			moviesToProcess.map((movie) => tmdb.getMovieDetails(movie))
		).then((details) => details.filter((detail) => detail.overview));

		console.info(`Processing ${fetchingMovies.length} movies at a time.`);

		const saved = await prisma.$transaction(
			fetchingMovies
				.map((movie) => new VectorMovieModel(movie))
				.map((data) => prisma.movie.create({ data }))
		);

		try {
			await vector.addModels(saved);
			console.info(`Successfull! ${movies.length} remaining.`);
		} catch {
			await prisma.movie.deleteMany({
				where: { id: { in: fetchingMovies.map((movie) => movie.id) } }
			});
			console.info(`Error creating embeddings, skipping... ${movies.length} remaining.`);
		}
	}
}
