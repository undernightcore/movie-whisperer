<div class="error">
	<h1>Sorry but I can't do that!</h1>
	<h4>Please report this bug, thank you!.</h4>
	<a href="https://github.com/undernightcore/movie-whisperer" target="_blank">
		<img alt="github logo" src="github.svg" />
	</a>
</div>

<style lang="scss">
	.error {
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;

		& > h1,
		h4 {
			margin: 0;
			text-align: center;
		}

		& > a {
			& > img {
				height: 32px;
			}
		}
	}
</style>
