<div class="spinner">
	<div class="spinner__inside">
		<div />
	</div>
</div>

<style>
	@keyframes spinner__animation {
		0% {
			transform: translate(-50%, -50%) rotate(0deg);
		}
		100% {
			transform: translate(-50%, -50%) rotate(360deg);
		}
	}
	.spinner__inside div {
		position: absolute;
		width: 60px;
		height: 60px;
		border: 10px solid var(--primary-color);
		border-top-color: transparent;
		border-radius: 50%;
	}
	.spinner__inside div {
		animation: spinner__animation 1s linear infinite;
		top: 100px;
		left: 100px;
	}

	.spinner {
		width: 200px;
		height: 200px;
		display: inline-block;
		overflow: hidden;
		background: none;
	}
	.spinner__inside {
		width: 100%;
		height: 100%;
		position: relative;
		transform: translateZ(0) scale(1);
		backface-visibility: hidden;
		transform-origin: 0 0;
	}
	.spinner__inside div {
		box-sizing: content-box;
	}
</style>
