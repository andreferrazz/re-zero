<script lang="ts">
	import { add } from '$lib/stores/taskStore.svelte.js';
	import { getTranslations } from '$lib/i18n/index.js';

	let t = $derived(getTranslations());
	let text = $state('');
	let inputEl: HTMLInputElement | null = null;

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = text.trim();
		if (!trimmed) return;
		text = '';
		await add(trimmed);
	}

	function handleInputKeydown(e: KeyboardEvent) {
		// Escape unfocuses the add-task input.
		if (e.key === 'Escape') {
			inputEl?.blur();
		}
	}

	function handleGlobalKeydown(e: KeyboardEvent) {
		// Shift+L focuses the add-task input.
		if (e.shiftKey && e.key.toLowerCase() === 'l') {
			// Don't hijack the key while the user is typing in a field.
			const el = e.target as HTMLElement | null;
			if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) {
				return;
			}
			e.preventDefault();
			inputEl?.focus();
		}
	}
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<form onsubmit={handleSubmit} class="flex gap-2 mb-8">
	<input
		id="add-input"
		bind:this={inputEl}
		bind:value={text}
		onkeydown={handleInputKeydown}
		type="text"
		placeholder={t.tasks.addPlaceholder}
		class="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-sm bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		autocomplete="off"
	/>
	<button
		type="submit"
		class="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
	>{t.tasks.add}</button>
</form>
