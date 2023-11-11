<script lang="ts">
	import { onMount } from 'svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import Button from '$lib/components/b-button.svelte';
	import { buildCoverUrl } from '$lib/utils/image.utils';
	import type { MovieInterface } from '$lib/interfaces/movie.interface';
	import { goto } from '$app/navigation';
	import { getLatestPrompt } from '$lib/services/movie.service';

	let movie: MovieInterface;

	export let data: { movieId: string };

	onMount(() => {
		fetchMovie();
	});

	async function fetchMovie() {
		const response = await fetch(`/api/movies/${data.movieId}`);
		if (!response.ok) return;
		movie = (await response.json()) as MovieInterface;
		console.log(movie);
	}

	function goBack() {
		const previousPrompt = getLatestPrompt();
		goto(previousPrompt ? `/recommend?search=${previousPrompt}` : '/');
	}
</script>

{#if movie}
	<div class="movie">
		<div class="movie__info">
			<h1>
				{movie.title}
				{#if movie.release}
					({new Date(movie.release).getFullYear()})
				{/if}
			</h1>
			<Button on:click={goBack} text="Back to list" button={true} />
		</div>
		<div class="movie__content">
			<img alt="movie cover" src={buildCoverUrl(movie.poster)} />
			<div class="movie__content__info">
				<div class="movie__content__info__overview">
					<h1>Overview</h1>
					<p>{movie.plot}</p>
				</div>
				<div class="movie__content__info__categories">
					<h1>Categories</h1>
					<div>
						{#each movie.category as category}
							<Button text={category.title} />
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
{:else}
	<div class="loading">
		<Spinner />
	</div>
{/if}

<style lang="scss">
	.movie {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		padding: 50px 56px;
		box-sizing: border-box;
		gap: 50px;

		&__content {
			height: 100%;
			display: flex;
			gap: 85px;
			overflow: auto;

			@media (max-width: 850px) {
				flex-direction: column;
				gap: 40px;

				& > img {
					max-width: fit-content;
				}
			}

			& > img {
				height: 100%;
				border-radius: 18px;
			}

			&__info {
				display: flex;
				flex-direction: column;
				gap: 28px;

				&__categories {
					& > div {
						display: flex;
						gap: 8px;
					}
				}
			}
		}
	}

	.loading {
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
