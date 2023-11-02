import { TMDB_API_KEY } from '$env/static/private';
import type { MovieDetailsInterface } from '$lib/interfaces/movie-details.interface';
import type { GenreInterface } from '$lib/interfaces/genre.interface';

class TmdbService {
	#url = 'https://api.themoviedb.org/3';
	#key = TMDB_API_KEY;

	async getCategories(): Promise<GenreInterface[]> {
		const response = await this.#fetchApi('/genre/movie/list?language=en');
		return response.genres;
	}

	getMovieDetails(movieId: number): Promise<MovieDetailsInterface> {
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
