<slot />

<style lang="scss">
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');

	:global(html) {
		height: 100%;
	}

	:global(body) {
		--primary-color: #d9d9d9;
		--secondary-color: #1e1e1e;

		font-family: Inter, sans-serif;
		color: var(--primary-color);

		height: 100%;
		overflow: auto;
		margin: 0;
	}
</style>
