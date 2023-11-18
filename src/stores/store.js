import { writable } from 'svelte/store';

export const userLoggedIn = writable(false);

export const loading = writable(false);

export const filter = writable(false);

export const todayAppts = writable(true);

export const waitingAppts = writable(false);

export const servingAppts = writable(false);

export const dispensaryAppts = writable(false);

export const showInvoice = writable(false);
