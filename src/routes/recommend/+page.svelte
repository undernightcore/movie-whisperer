<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/b-button.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import { buildCoverUrl } from '$lib/utils/image.utils';
	import type { MovieSimpleInterface } from '$lib/interfaces/movie.interface';
	import { getRecommendedMovies } from '$lib/services/movie.service';

	const search = $page.url.searchParams.get('search');

	let movies: MovieSimpleInterface[];

	onMount(() => {
		if (search) {
			getMovies(search);
		} else {
			goto('/');
		}
	});

	async function getMovies(search: string) {
		movies = await getRecommendedMovies(search);
	}
</script>

<div class="results">
	<div class="results__info" style:padding-bottom={movies ? '50px' : '0'}>
		<h1>"{search ?? 'Empty'}"</h1>
		<Button button={true} on:click={() => goto('/')} text="Search again" />
	</div>

	{#if movies}
		<div class="results__items">
			{#each movies as { poster, id } (id)}
				<div
					on:click={() => goto(`/movies/${id}`)}
					style:background="url({buildCoverUrl(poster)})"
					class="results__items__cover"
				/>
			{/each}
		</div>
	{:else}
		<div class="results__loading">
			<Spinner />
		</div>
	{/if}
</div>

<style lang="scss">
	.results {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
		padding: 50px 56px;
		box-sizing: border-box;

		&__info {
			& > h1 {
				color: var(--primary-color);
			}
		}

		&__items {
			display: flex;
			flex-wrap: wrap;
			overflow: auto;
			gap: 32px;

			padding-right: 16px;

			&__cover {
				background-repeat: no-repeat !important;
				background-size: cover !important;
				height: 300px;
				width: 210px;
				border-radius: 18px;
				cursor: pointer;
			}
		}

		&__loading {
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
		}
	}
</style>
