<script lang="ts">
	import Search from '$lib/components/search.svelte';
	import { goto } from '$app/navigation';
</script>

<div class="home">
	<h1>Movie Whisperer</h1>
	<h2>Built with SvelteKit, Langchain and Prisma!</h2>
	<div>
		<Search on:search={({ detail }) => goto(`/recommend?search=${detail}`)} />
	</div>
</div>

<style lang="scss">
	.home {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: var(--secondary-color);
		height: 100%;
		width: 100%;

		& > h1 {
			font-size: 50px;
			text-align: center;

			margin-top: 0;
			margin-bottom: 8px;
		}

		& > h2 {
			font-size: 14px;
			text-align: center;

			margin-top: 0;
			margin-bottom: 16px;
		}

		& > div {
			width: 80%;
			max-width: 600px;
		}
	}
</style>
