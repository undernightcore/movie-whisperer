<script lang="ts">
	export let text = '';
	export let button = false;
</script>

<button on:click>
	{#if button}
		<img alt="back icon" src="/back.png" />
	{/if}
	{text}
</button>

<style>
	button {
		display: flex;
		gap: 4px;
		padding: 4px 10px;
		border-radius: 16px;
		border: 0;
		cursor: pointer;

		align-items: center;
		justify-content: center;

		height: 28px;
		width: fit-content;
		background-color: var(--primary-color);

		& > img {
			height: 20px;
		}
	}
</style>
