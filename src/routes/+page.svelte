<script lang="ts">
	import Header from '../lib/components/Header.svelte';
	import Analyzer from '../lib/components/analyzer/Analyzer.svelte';
	import type { ActionData } from './$types';

	export let form: ActionData;
</script>

<Header />
<Analyzer {form} />
