<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import { getTheme } from '$lib/stores/themeStore.svelte.js';

	let { children }: { children: Snippet } = $props();

	$effect(() => {
		document.documentElement.classList.toggle('dark', getTheme() === 'dark');
	});

	$effect(() => {
		let stop: (() => void) | undefined;
		(async () => {
			const [tasks, sync] = await Promise.all([
				import('$lib/stores/taskStore.svelte.js'),
				import('$lib/stores/syncStore.svelte.js')
			]);
			tasks.refresh();
			tasks.startListening();
			sync.startSync();
			stop = tasks.stopListening;
		})();

		return () => stop?.();
	});
</script>

{@render children()}
