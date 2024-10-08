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

// 4. Panel patients
// - figure out what needs to be known for panel patients
// - might need to alter database here

// MISCELLANEOUS
// show correct alerts and loading
// need to see what that docs are in the backend 13,17,18 and all and make sure they're not stored here anymore or delete them straight away
// should do better with data sales page.. should filter using dates and shit

// STYLING
// 1. style invoice and MC. and general styling, layout, icons, dropdown menu etc
// 2. - for edit page, the rows must be of constant size, and if got overflow, users can click see more button. basically make rows constant no matter what. stylist can do.
// 3. // need to arrange consultations page and show patient history properly!

// BIG PROBLEMS
// 1. reactivity
// go through all reactivity!

// 1. when patients register for walkin appointment(new or existing) in registration, it needs to show immideately in home page - DONE
// 2. same as above but show in quque also - DONE
// 3. once doctor calls in, should be removed from waiting in home page - done
// 4. once doctor calls in, should remove from  queue in consultations - done
// 5. once doctor ends it should be in dispensary startight away - done
// 6. once doctor ends it should be removed from queue - done
// 7. when booking appointment click arrives, needs to show in waiting appointment tab - done
// 8. need errors to be reactive - e.g. when i submit form and got error, it should go away after I do another input! e.g. put IC with -, then ahve invalid IC error, but then I input again but input ic which is not registered for get patient, and it should show new error. not the all error

// q's to ask
// what do you want as inputs in forms?
// do you need the meds count and shit? reason is if they didnt update system when restock, it'll stop you being able to add treatment plan
// whats your consultation fee?
// do you want meds and doctor fields data?

// UPDATED
// all ok when nurses see it.
// for doctors all looks ok
// need to delete the dockerfile in backend directory
