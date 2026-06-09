import { fail } from '@sveltejs/kit';
import { COUCHDB_URL, COUCHDB_USER, COUCHDB_PASSWORD } from '$env/static/private';
import type { Actions } from './$types.js';

const AUTH = 'Basic ' + btoa(`${COUCHDB_USER}:${COUCHDB_PASSWORD}`);

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const name = String(data.get('name') ?? '').trim();
		const password = String(data.get('password') ?? '');

		if (!name || !password) {
			return fail(400, { error: 'Missing fields' });
		}

		const id = `org.couchdb.user:${name}`;
		const response = await fetch(`${COUCHDB_URL}/_users/${encodeURIComponent(id)}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: AUTH
			},
			body: JSON.stringify({ _id: id, name, password, roles: [], type: 'user' })
		});

		if (response.status === 409) {
			return fail(409, { error: 'Username already taken' });
		}
		if (!response.ok) {
			return fail(500, { error: 'Sign-up failed' });
		}

		return { success: true, username: name };
	}
};
