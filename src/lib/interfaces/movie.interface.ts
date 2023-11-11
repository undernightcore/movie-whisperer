export interface MovieInterface {
	id: number;
	title: string;
	plot: string;
	poster: string;
	backdrop: string | null;
	rating: number;
	release: string | null;
	duration: number;
	inWatchList: boolean;
	category: { id: string; title: string }[];
}

export type MovieSimpleInterface = Omit<MovieInterface, 'backdrop' | 'duration' | 'inWatchList'>;
