import type { TmdbMovieDetailsInterface } from '$lib/interfaces/movie-details.interface';
import type { Movie } from '@prisma/client';
import { DateTime } from 'luxon';

export class VectorMovieModel implements Movie {
	id: number;
	backdrop: string | null;
	plot: string;
	title: string;
	duration: number;
	poster: string;
	release: Date | null;
	rating: number;
	category: { connect: { id: number }[] };

	constructor(data: TmdbMovieDetailsInterface, extendedPlot: string | undefined) {
		this.id = data.id;
		this.backdrop = data.backdrop_path;
		this.plot = extendedPlot || data.overview;
		this.duration = data.runtime;
		this.title = data.title;
		this.poster = data.poster_path ?? '';
		this.rating = data.vote_average;
		this.category = { connect: data.genres.map(({ id }) => ({ id })) };
		this.release = data.release_date
			? DateTime.fromFormat(data.release_date, 'yyyy-MM-dd').toJSDate()
			: null;
	}
}
