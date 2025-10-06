<script>
	import { enhance } from '$app/forms';
</script>

<form method="POST" action="?/analyze" use:enhance>
	<input name="username" placeholder="@username" required />
	<button type="submit">Analyze Personality</button>
</form>

<style lang="scss">
	form {
		display: flex;
		width: 100%;
		gap: 1rem;

		padding-inline: 4rem;

		input {
			padding: 0.75rem 1rem;
			background-color: rgba(255, 255, 255, 0.04);
			border: 1px solid rgba(255, 255, 255, 0.12);
			border-radius: 0.5rem;
			color: white;

			box-shadow: inset 0 0 1rem 0 rgba(0, 0, 0, 0.48);

			width: 100%;
		}

		button {
			all: unset;
			cursor: pointer;
			white-space: nowrap;
			padding: 0.75rem 2rem;
			background: rgba(255, 255, 255, 0.08);
			color: white;
			border: 1px solid rgba(255, 255, 255, 0.24);
			border-radius: 0.5rem;

			transition: all 0.2s ease-in-out;

			&:active {
				transform: scale(0.98);
			}

			&:hover {
				background-color: rgba(255, 255, 255, 0.12);
				border: 1px solid rgba(255, 255, 255, 0.48);
			}
		}
	}
</style>
