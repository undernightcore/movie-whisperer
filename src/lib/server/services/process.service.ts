import { prisma } from '$lib/server/services/prisma.service';
import { tmdb } from '$lib/server/services/tmdb.service';
import { getVectorStore } from '$lib/server/helpers/vector.helper';
import { VectorMovieModel } from '$lib/server/models/vector-movie.model';
import { sse } from '$lib/server/services/sse.service';
import { omdb } from './omdb.service';

class ProcessService {
	#isCurrentlyProcessing = false;

	get isCurrentProcessing() {
		return this.#isCurrentlyProcessing;
	}

	async startProcessing(amount: number) {
		this.#isCurrentlyProcessing = true;

		try {
			await this.#processCategories();
			await this.#processMovies(amount);
		} catch (e) {
			console.error(e);
		}

		this.stopProcessing();
	}

	stopProcessing() {
		this.#isCurrentlyProcessing = false;
	}

	async #processCategories() {
		const localCategories = await prisma.category
			.findMany()
			.then((categories) => categories.map((category) => category.id));

		const remoteCategories = await tmdb
			.getCategories()
			.then((categories) =>
				categories
					.filter((category) => !localCategories.includes(category.id))
					.map(({ id, name }) => ({ id, title: name }))
			);

		await prisma.category.createMany({ data: remoteCategories });
	}

	async #processMovies(amount: number) {
		const localMovies = await prisma.movie
			.findMany({ select: { id: true } })
			.then((ids) => new Set(ids.map(({ id }) => id)));

		const movies = await tmdb
			.getAllMovieIds()
			.then((ids) => ids.slice(0, amount).filter((id) => !localMovies.has(id)));

		const vector = getVectorStore();

		while (movies.length && this.#isCurrentlyProcessing) {
			const moviesToProcess = movies.splice(0, 10);

			const fetchingMovies = await Promise.all(
				moviesToProcess.map((movie) => tmdb.getMovieDetails(movie))
			);

			const betterPlots = omdb.isInitialized()
				? await Promise.all(fetchingMovies.map(({ imdb_id }) => omdb.getLongerPlot(imdb_id)))
				: [];

			const saved = await prisma.$transaction(
				fetchingMovies
					.filter((detail) => detail.overview && detail.poster_path)
					.map((movie, index) => new VectorMovieModel(movie, betterPlots[index]))
					.map((data) => prisma.movie.create({ data }))
			);

			try {
				await vector.addModels(saved);
			} catch {
				await prisma.movie.deleteMany({
					where: { id: { in: fetchingMovies.map((movie) => movie.id) } }
				});
			}

			sse.sendMessage(JSON.stringify({ remaining: movies.length }));
		}
	}
}

export const processService = new ProcessService();
