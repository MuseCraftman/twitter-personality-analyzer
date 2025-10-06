<script lang="ts">
	import AnalyzerInput from './AnalyzerInput.svelte';
	import AnalyzerOutput from './AnalyzerOutput.svelte';

	export let form;

	let loading = false;
</script>

<div class="content">
	<div class="padding-global padding-small">
		<div class="container">
			<div class="content-inner">
				<AnalyzerInput bind:loading />
				<AnalyzerOutput {form} {loading} />
			</div>
		</div>
	</div>
</div>
