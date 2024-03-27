import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
import { getDoctorTokenFromLocalStorage, getUserTokenFromLocalStorage } from '../utils/auth.js';
import { redirect } from '@sveltejs/kit';

export async function load({ fetch }) {
	// here if there is no doctor token, then redirect to home page
	if (!getDoctorTokenFromLocalStorage() && !getUserTokenFromLocalStorage()) {
		throw redirect(307, '/sign-in');
	}
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-booking-today');

	const res = await resp.json();
	if (resp.status == 200) {
		const resp2 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-waiting');

		const res2 = await resp2.json();

		const resp3 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-dispensary');
		const res3 = await resp3.json();

		const resp4 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-all');
		const res4 = await resp4.json();

		const resp5 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-booking');
		const res5 = await resp5.json();

		return {
			todayBookingAppointments: res.appointmentsBookingToday,
			waitingAppointments: res2.appointmentsWaiting,
			dispensaryAppointments: res3.appointmentsDispensary,
			allAppointments: res4.appointmentsAll,
			bookingAppointments: res5.appointmentsBooking
		};
	} else {
		return {
			todayBookingAppointments: [],
			waitingAppointments: [],
			dispensaryAppointments: [],
			allAppointments: [],
			bookingAppointments: []
		};
	}
}

// FEATURES TO DO

// 2. Send automated normal message
// inside the message, is link to google review

// 3, Payments

// 4. Panel patients
// - figure out what needs to be known for panel patients
// - might need to alter database here

// 5. analytics
// - get sales, purchase and other analytics data
// - must display them properly in a systematic way where you can filter them out easily

// 6. Create records
// not like analytics, but just pure tables for sales and purchases.

// 7. database expansion

// MISCELLANEOUS
// show correct alerts and loading
// go through all forms and check for error handling (all possible ways it can go wrong)
// in registration page, the existing page is fucked... we fucked it up.. now for the newpatient section, we need to have existng patient button there, and once clicked, it'll open a form w reason only... but int he booking section, there is also a existning patient button, but when we click it, it opens up form with bookingdate and reason... also, when we click set appointment when we're in new patient or booking patient, it doesnt go through... then once we click setappointment it should go to ori state, depending if it is new or existing... also same w cancel next to set appointment

// STYLING
// 1. style invoice and MC. and general styling, layout, icons, dropdown menu etc
// 2. - for edit page, the rows must be of constant size, and if got overflow, users can click see more button. basically make rows constant no matter what. stylist can do.
// 3. // need to arrange consultations page and show patient history properly!

// BIG PROBLEMS
// 1. reactivity
// go through all reactivity!
// UNABLE TO REACTIVELY SHOW changes between components
// register and show in appointments in /+page.svelte, and register then show in queue
// once doctor calls in, should be removed from waiting, and once doctor ends, it should be in dispensary startight away, and removed from queue
// when booking appointment arrives, needs to show in waiting
// when you delete medicine, it should show that its deleted immideately
// when doctor clicks end consultation and sees queueu, queue should be auto updated

// q's to ask
// what do you want as inputs in forms?
// do you need the meds count and shit? reason is if they didnt update system when restock, it'll stop you being able to add treatment plan

// NOW DOING
// comment away doctor from all forms
// do gender thingy for all forms
