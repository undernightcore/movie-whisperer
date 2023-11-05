import { TMDB_API_KEY } from '$env/static/private';
import type { MovieDetailsInterface } from '$lib/interfaces/movie-details.interface';
import type { GenreInterface } from '$lib/interfaces/genre.interface';
import { DateTime } from 'luxon';
import { ungzip } from 'node-gzip';

class TmdbService {
	#url = 'https://api.themoviedb.org/3';
	#exportUrl = 'https://files.tmdb.org/p/exports/movie_ids';
	#key = TMDB_API_KEY;

	async getAllMovieIds(): Promise<number[]> {
		const today = DateTime.now().toFormat('MM_dd_yyyy');
		const response = await fetch(`${this.#exportUrl}_${today}.json.gz`);

		if (!response.ok)
			throw new Error(
				'Fetching movies from TMDB failed. They might not have published today movie list yet.'
			);

		const uncompressed = await ungzip(await response.arrayBuffer());
		return uncompressed
			.toString()
			.split('\n')
			.filter((data) => data)
			.map((movie) => JSON.parse(movie))
			.map((movie) => movie.id);
	}

	async getCategories(): Promise<GenreInterface[]> {
		const response = await this.#fetchApi('/genre/movie/list?language=en');
		return response.genres;
	}

	async getMovieDetails(movieId: number): Promise<MovieDetailsInterface> {
		return this.#fetchApi(`/movie/${movieId}?language=en`);
	}

	async #fetchApi(path: string) {
		const response = await fetch(`${this.#url}${path}`, {
			headers: { authorization: `Bearer ${this.#key}` }
		});

		return response.json();
	}
}

export const tmdb = new TmdbService();
