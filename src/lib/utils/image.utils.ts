export function buildCoverUrl(coverPath: string | null) {
	return coverPath ? `https://image.tmdb.org/t/p/w300/${coverPath}` : `/nocover.png`;
}
