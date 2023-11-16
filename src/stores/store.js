import { writable } from 'svelte/store';

export const userLoggedIn = writable(false);

export const loading = writable(false);

export const filter = writable(false);
