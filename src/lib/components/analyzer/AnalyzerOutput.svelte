<script>
	export let form;
	export let loading = false;
</script>

{#if loading}
	<div class="analysis-loading">
		<div class="skeleton title"></div>
		<div class="skeleton block"></div>
		<div class="skeleton block"></div>
		<div class="skeleton block"></div>
	</div>
{:else if form?.success && form.analysis}
	<div class="analysis-results">
		<h2>Analysis Results for @{form.analysis.username}</h2>

		<div class="summary">
			<h3>Summary</h3>
			<p>{form.analysis.summary}</p>
		</div>

		<div class="personality-traits">
			<h3>Personality Traits (Big Five)</h3>
			<div class="traits-grid">
				{#each Object.entries(form.analysis.personalityTraits) as [trait, score]}
					<div class="trait">
						<span class="trait-name">{trait.charAt(0).toUpperCase() + trait.slice(1)}</span>
						<div class="trait-bar">
							<div class="trait-fill" style="width: {score * 100}%"></div>
						</div>
						<span class="trait-score">{Math.round(score * 100)}%</span>
					</div>
				{/each}
			</div>
		</div>

		<div class="key-insights">
			<h3>Key Insights</h3>
			<ul>
				{#each form.analysis.keyInsights as insight}
					<li>{insight}</li>
				{/each}
			</ul>
		</div>
	</div>
{:else if form?.success === false}
	<div class="error">
		<p>❌ {form.error}</p>
	</div>
{/if}

<style lang="scss">
	.analysis-results {
		margin-top: 2rem;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 0.75rem;
		box-shadow: inset 0 0 1rem 0 rgba(0, 0, 0, 0.48);

		h2 {
			color: white;
			margin-bottom: 1.5rem;
			font-size: 1.5rem;
		}

		h3 {
			color: rgba(255, 255, 255, 0.9);
			margin: 1.5rem 0 1rem 0;
			font-size: 1.2rem;
		}

		.summary p {
			color: rgba(255, 255, 255, 0.8);
			line-height: 1.6;
		}

		.traits-grid {
			display: grid;
			gap: 1rem;
		}

		.trait {
			display: grid;
			grid-template-columns: 1fr 2fr auto;
			align-items: center;
			gap: 1rem;
		}

		.trait-name {
			color: rgba(255, 255, 255, 0.9);
			font-weight: 500;
			min-width: 120px;
		}

		.trait-bar {
			height: 8px;
			background: rgba(255, 255, 255, 0.1);
			border-radius: 4px;
			overflow: hidden;
		}

		.trait-fill {
			height: 100%;
			background: linear-gradient(90deg, #4f46e5, #06b6d4);
			border-radius: 4px;
			transition: width 0.3s ease;
		}

		.trait-score {
			color: rgba(255, 255, 255, 0.7);
			font-size: 0.9rem;
			min-width: 40px;
			text-align: right;
		}

		.key-insights ul {
			list-style: none;
			padding: 0;
		}

		.key-insights li {
			color: rgba(255, 255, 255, 0.8);
			padding: 0.5rem 0;
			border-bottom: 1px solid rgba(255, 255, 255, 0.1);

			&:last-child {
				border-bottom: none;
			}

			&::before {
				content: '💡';
				margin-right: 0.5rem;
			}
		}
	}

	.error {
		margin-top: 2rem;
		padding: 1rem;
		background: rgba(239, 68, 68, 0.1);
		border: 1px solid rgba(239, 68, 68, 0.3);
		border-radius: 0.5rem;
		color: #fca5a5;
	}

	.analysis-loading {
		margin-top: 2rem;
		padding: 2rem;
		background: rgba(255, 255, 255, 0.04);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 0.75rem;
		box-shadow: inset 0 0 1rem 0 rgba(0, 0, 0, 0.48);

		.skeleton {
			background: linear-gradient(
				90deg,
				rgba(255, 255, 255, 0.06) 25%,
				rgba(255, 255, 255, 0.12) 37%,
				rgba(255, 255, 255, 0.06) 63%
			);
			background-size: 400% 100%;
			animation: shimmer 1.4s ease infinite;
			border-radius: 0.5rem;
			margin: 0.75rem 0;
		}

		.title {
			height: 24px;
			width: 60%;
		}
		.block {
			height: 16px;
			width: 100%;
		}
	}

	@keyframes shimmer {
		0% {
			background-position: 100% 0;
		}
		100% {
			background-position: -100% 0;
		}
	}
</style>
