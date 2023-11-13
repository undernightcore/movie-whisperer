import { prisma } from '$lib/server/services/prisma.service';
import { tmdb } from '$lib/server/services/tmdb.service';
import { getVectorStore } from '$lib/server/helpers/vector.helper';
import { VectorMovieModel } from '$lib/server/models/vector-movie.model';
import { sse } from '$lib/server/services/sse.service';

class ProcessService {
	#isCurrentlyProcessing = false;

	get isCurrentProcessing() {
		return this.#isCurrentlyProcessing;
	}

	async startProcessing() {
		this.#isCurrentlyProcessing = true;

		try {
			await this.#processCategories();
			await this.#processMovies();
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

	async #processMovies() {
		const localMovies = await prisma.movie
			.findMany({ select: { id: true } })
			.then((ids) => new Set(ids.map(({ id }) => id)));

		const movies = await tmdb
			.getAllMovieIds()
			.then((ids) => ids.filter((id) => !localMovies.has(id)));

		const vector = getVectorStore();

		while (movies.length && this.#isCurrentlyProcessing) {
			const moviesToProcess = movies.splice(0, 10);

			const fetchingMovies = await Promise.all(
				moviesToProcess.map((movie) => tmdb.getMovieDetails(movie))
			).then((details) => details.filter((detail) => detail.overview && detail.poster_path));

			const saved = await prisma.$transaction(
				fetchingMovies
					.map((movie) => new VectorMovieModel(movie))
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

			// Just to throttle http requests to avoid being rate limited
			await new Promise((resolve) => setTimeout(resolve, 200));
		}
	}
}

export const processService = new ProcessService();
