import type { GenreInterface } from '$lib/interfaces/genre.interface';

export interface MovieDetailsInterface {
	id: number;
	backdrop_path: string;
	poster_path: string;
	genres: GenreInterface[];
	title: string;
	overview: string;
	release_date: string;
	runtime: number;
	vote_average: number;
}
