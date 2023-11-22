import { env } from '$env/dynamic/private';
import type { GenreInterface } from '$lib/interfaces/genre.interface';
import type {
	TmdbMovieDetailsInterface,
	TmdbMovieDumpInterface
} from '$lib/interfaces/movie-details.interface';
import { DateTime } from 'luxon';
import gzip from 'node-gzip';
const { ungzip } = gzip;

class TmdbService {
	#url = 'https://api.themoviedb.org/3';
	#exportUrl = 'https://files.tmdb.org/p/exports/movie_ids';
	#key = env.TMDB_API_KEY;

	async getAllMovieIds(): Promise<number[]> {
		const response = await this.#fetchBackwards(DateTime.now(), 5);

		if (!response.ok)
			throw new Error('Fetching movies from TMDB failed after 5 times. Check your API key.');

		const uncompressed = await ungzip(await response.arrayBuffer());
		return uncompressed
			.toString()
			.split('\n')
			.filter((data) => data)
			.map((movie) => JSON.parse(movie) as TmdbMovieDumpInterface)
			.sort((a, b) => b.popularity - a.popularity)
			.map((movie) => movie.id);
	}

	async getCategories(): Promise<GenreInterface[]> {
		const response = await this.#fetchApi('/genre/movie/list?language=en');
		return response.genres;
	}

	async getMovieDetails(movieId: number): Promise<TmdbMovieDetailsInterface> {
		return this.#fetchApi(`/movie/${movieId}?language=en`);
	}

	async #fetchApi(path: string) {
		const response = await fetch(`${this.#url}${path}`, {
			headers: { authorization: `Bearer ${this.#key}` }
		});

		if (!response.ok)
			throw new Error(`Something broke when calling TMDB! Status ${response.status}.`);

		return response.json();
	}

	async #fetchBackwards(date: DateTime, retries: number): Promise<Response> {
		const formatDate = date.toFormat('MM_dd_yyyy');

		const response = await fetch(`${this.#exportUrl}_${formatDate}.json.gz`);
		const yesterday = date.minus({ day: 1 });

		return !response.ok && retries > 0 ? this.#fetchBackwards(yesterday, retries - 1) : response;
	}
}

export const tmdb = new TmdbService();
