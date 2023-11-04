import type { Movie } from '@prisma/client';
import type { MovieDetailsInterface } from '$lib/interfaces/movie-details.interface';
import { DateTime } from 'luxon';

export class VectorMovieModel implements Movie {
	id: number;
	backdrop: string | null;
	plot: string;
	title: string;
	content: string;
	duration: number;
	poster: string | null;
	release: Date | null;
	rating: number;
	category: { connect: { id: number }[] };

	constructor(data: MovieDetailsInterface) {
		this.id = data.id;
		this.backdrop = data.backdrop_path;
		this.content = `${data.overview}`;
		this.plot = data.overview;
		this.duration = data.runtime;
		this.title = data.title;
		this.poster = data.poster_path;
		this.rating = data.vote_average;
		this.category = { connect: data.genres.map(({ id }) => ({ id })) };
		this.release = data.release_date
			? DateTime.fromFormat(data.release_date, 'yyyy-MM-dd').toJSDate()
			: null;
	}
}
