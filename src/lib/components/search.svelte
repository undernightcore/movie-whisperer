<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	let search = '';
</script>

<div class="search">
	<input
		bind:value={search}
		on:keydown={(e) => (e.key === 'Enter' && search ? dispatch('search', search) : undefined)}
	/>
	<button on:click={() => (search ? dispatch('search', search) : undefined)}>
		<img alt="search icon" src="search.png" />
	</button>
</div>

<style lang="scss">
	.search {
		display: flex;
		gap: 20px;

		& > input {
			background-color: var(--primary-color);
			border-radius: 24px;
			border: 0;
			outline: none;
			width: 100%;
			padding: 0 20px;
		}

		& > button {
			display: flex;
			align-items: center;
			justify-content: center;

			cursor: pointer;
			background-color: var(--primary-color);
			border: 0;
			height: 32px;
			min-width: 32px;
			border-radius: 24px;

			& > img {
				height: 16px;
			}
		}
	}
</style>
