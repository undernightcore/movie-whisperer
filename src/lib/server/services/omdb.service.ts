import { env } from '$env/dynamic/private';
import type { OmdbMovieDetailsInterface } from '$lib/interfaces/movie-details.interface';

class OmdbService {
	#key = env.OMDB_API_KEY;
	#url = `http://www.omdbapi.com/?apikey=${this.#key}`;

	isInitialized() {
		return Boolean(this.#key);
	}

	async getLongerPlot(imdbId: string): Promise<string | undefined> {
		const response = await fetch(`${this.#url}&i=${imdbId}&plot=full`);

		if (!response.ok) {
			console.error(`ERROR: Omdb request failed for movie ${imdbId} with ${response.status} error`);
			return undefined;
		}

		const movie = (await response.json()) as OmdbMovieDetailsInterface;

		return movie.Plot ?? undefined;
	}
}

export const omdb = new OmdbService();
