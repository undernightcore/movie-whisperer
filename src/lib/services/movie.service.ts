import type { MovieSimpleInterface } from "$lib/interfaces/movie.interface";

let latestPrompt: string | undefined;
let movies: MovieSimpleInterface[] | undefined;

export async function getRecommendedMovies(search: string): Promise<MovieSimpleInterface[]> {
    if (search === latestPrompt && movies) return movies

    const response = await fetch(`/api/movies/recommend?search=${search}`);
    if (!response.ok) throw new Error(`Get movies failed with status ${response.status}`)

    const moviesResponse = await response.json()
    movies = moviesResponse
    latestPrompt = search
    return moviesResponse
}

export function getLatestPrompt() {
    return latestPrompt
}