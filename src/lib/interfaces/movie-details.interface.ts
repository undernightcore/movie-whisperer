import type { GenreInterface } from '$lib/interfaces/genre.interface';

export interface MovieDetailsInterface {
	id: number;
	backdrop_path: string | null;
	poster_path: string | null;
	genres: GenreInterface[];
	title: string;
	overview: string;
	release_date: string;
	runtime: number;
	vote_average: number;
}
