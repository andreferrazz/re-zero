<script lang="ts">
	import type { SyncStatus } from '$lib/types.js';
	import { getSyncStatus, logout } from '$lib/stores/syncStore.svelte.js';
	import { getTranslations } from '$lib/i18n/index.js';

	let t = $derived(getTranslations());

	let labels: Record<SyncStatus, string> = $derived({
		synced: t.sync.synced,
		syncing: t.sync.syncing,
		offline: t.sync.offline,
		local: t.sync.local,
	});

	const colors: Record<SyncStatus, string> = {
		synced: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
		syncing: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
		offline: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
		local: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400',
	};

	let status = $derived(getSyncStatus());
	let menuOpen = $state(false);

	async function handleLogout() {
		menuOpen = false;
		await logout();
	}
</script>

{#if status === 'local'}
	<a href="/login" class="text-xs px-2 py-0.5 rounded-full {colors[status]} hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
		{labels[status]}
	</a>
{:else}
	<div class="relative">
		<button
			type="button"
			onclick={() => (menuOpen = !menuOpen)}
			class="text-xs px-2 py-0.5 rounded-full {colors[status] || ''} hover:opacity-80 transition-opacity cursor-pointer"
		>
			{labels[status] || status}
		</button>
		{#if menuOpen}
			<button
				type="button"
				class="fixed inset-0 z-10 cursor-default"
				aria-label="Close menu"
				onclick={() => (menuOpen = false)}
			></button>
			<div class="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
				<button
					type="button"
					onclick={handleLogout}
					class="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					{t.sync.logout}
				</button>
			</div>
		{/if}
	</div>
{/if}
