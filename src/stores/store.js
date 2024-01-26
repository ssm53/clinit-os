import { writable } from 'svelte/store';

export const userLoggedIn = writable(false);

export const loading = writable(false);

export const filter = writable(false);

export const todayAppts = writable(false);

export const waitingAppts = writable(true);

export const servingAppts = writable(false);

export const dispensaryAppts = writable(false);

export const allAppts = writable(false);

export const followUpAppts = writable(false);

export const showInvoice = writable(false);
