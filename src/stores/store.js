import { writable } from 'svelte/store';

export const userLoggedIn = writable(false);

export const loading = writable(false);

export const filter = writable(false);

export const todayAppts = writable(false);

export const waitingAppts = writable(true);

export const servingAppts = writable(false);

export const dispensaryAppts = writable(false);

export const allAppts = writable(false);

export const bookingAppts = writable(false);

export const showInvoice = writable(false);

export const appointmentsWaiting = writable([]); // for reactivity when click cancel in waiting

export const appointmentsDispensary = writable([]); // for reactivity when click cancel in waiting

export const appointmentsToday = writable([]); // for reactivity when click cancel in waiting

export const appointmentsBooking = writable([]); // for reactivity when click cancel in waiting
