<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import Button from '$lib/components/b-button.svelte';
	import Spinner from '$lib/components/spinner.svelte';
	import type { Movie } from '@prisma/client';

	const search = $page.url.searchParams.get('search');

	let movies: Movie[];

	onMount(() => {
		if (!search) goto('/');
		getMovies(search);
	});

	function buildCoverUrl(coverPath: string | null) {
		return coverPath ? `url(https://image.tmdb.org/t/p/w300/${coverPath})` : `url(/nocover.png)`;
	}

	async function getMovies(search: string) {
		const response = await fetch(`/api/movies/recommend?search=${search}`);
		if (!response.ok) return;
		movies = await response.json();
	}
</script>

<div class="results">
	<div class="results__info" style:padding-bottom={movies ? '50px' : '0'}>
		<h1>"{search}"</h1>
		<Button button={true} on:click={() => goto('/')} text="Search again" />
	</div>

	{#if movies}
		<div class="results__items">
			{#each movies as { poster }}
				<div style:background={buildCoverUrl(poster)} class="results__items__cover" />
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
		background-color: var(--secondary-color);
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
			justify-content: space-between;
			gap: 32px;

			padding-right: 16px;

			&__cover {
				background-repeat: no-repeat !important;
				background-size: cover !important;
				height: 300px;
				width: 210px;
				border-radius: 18px;
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
