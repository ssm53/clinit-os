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

// Inventory
// better way of doing inventory  sorta done

// timetable

// 7. Miscellaneous

// when editingcompleted appointments in edit tab, there is a normal form, but for them to edit documents, needs to be more detailed eg delete document/ add document. should be able to filter kaw2 for dates, e.g. appts this month, today, yesterday, this week. for mc and referral letter, we can have fields, but we also need to store it in documents field in appts
// refactor forms and make it into a component to be imported.. // here, docs will upload any pdf's they want to be part of documents - also can be as many as they want.
// in queue consultation page, fix the waitingTime as some are NaN
// go through consulattions page
// show correct alerts
// why cant I add treatment plan for panadol, but others can
// why cant i choose file in consulattions page

// NOW DOING
//

// STYLING
// 1. style invoice and MC. and general styling, layout, icons, dropdown menu etc
// 2. - for edit page, the rows must be of constant size, and if got overflow, users can click see more button. basically make rows constant no matter what. stylist can do.
// 3. // need to arrange consultations page and show patient history properly!

// BIG PROBLEMS
// 1. reactivity
// UNABLE TO REACTIVELY SHOW changes between components
// register and show in appointments in /+page.svelte, and register then show in queue
// once doctor calls in, should be removed from waiting, and once doctor ends, it should be in dispensary startight away
// when booking appointment arrives, needs to show in waiting
// when you delete medicine, it should show that its deleted immideately
// when doctor clicks end consultation and sees queueu, queue should be auto updated
