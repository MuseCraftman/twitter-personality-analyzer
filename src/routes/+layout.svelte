<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Footer from './components/Footer.svelte';
	import '../styles/global.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="page-wrapper">
	<slot />
	<Footer />
</div>
