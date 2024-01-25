import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-today');

	const res = await resp.json();
	if (resp.status == 200) {
		const resp2 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-waiting');

		const res2 = await resp2.json();

		const resp3 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-dispensary');
		const res3 = await resp3.json();

		const resp4 = await fetch(PUBLIC_BACKEND_BASE_URL + '/appointment-all');
		const res4 = await resp4.json();

		const resp5 = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-follow-up-details');
		const res5 = await resp5.json();

		return {
			todayAppointments: res.appointmentsToday,
			waitingAppointments: res2.appointmentsWaiting,
			dispensaryAppointments: res3.appointmentsDispensary,
			allAppointments: res4.appointmentsAll,
			followUpDetails: res5.followUpDetails
		};
	} else {
		return {
			todayAppointments: [],
			waitingAppointments: [],
			dispensaryAppointments: [],
			followUpDetails: []
		};
	}
}

// FEATURES TO DO

// 1. Upload and store PDF/images/docs
// - be able to save that invoice in database
// - upload and store pdf and images for patient history (same way as recepits and invoices la)

// 2. Send automated whatsapp messages
// - send automated whatsapp messages to remind follow updated, various promos
// - send automated whatsapp message to get them to google review

// 3, Payments

// 4. Panel patients
// - figure out what needs to be known for panel patients
// - might need to alter database here

// 6. analytics
// - get sales, purchase and other analytics data
// - must display them properly in a systematic way where you can filter them out easily

// 7. Miscellaneous
// 1) change default value of any date time to a better one. now() isnt too great.
// 2) waitingTime field in appointment table - maybe need to change the type
// 3) for appointmensts page, make sure to ensure that even when there is zero data for each waiting, today, dispensary and serving, it doesnt become error.. that means in html, need to ifdispenasryappts && dispeanryappinet. length > 0
// 4) in consultations page.svelte, when doing treatment plan, should do better with form. allow to only input one row, and can add rows. we also need to ensure there is enough fields for medicine in our appointment table. at the moment, we only have 2.
// 5) when we do end consultation, it automatically goes back to queue for doctor to know who is the next patient.  but when it goes back, we hae to reload to see the updated queue. we need it to be autimatically updated. we also need to see if doc starts consultation and hasnt ended it yet, it is still in the queue but in a diff part of queue.
// 6) in appointment page, just like the above issue, when it reaches 12am, appointments refresh and there is none, and hence there will be an error! need to avoid this
// 9) need to ensure we can edit shits even when there are no inputs in those fields
// 10) need to ensure reload auto for all shits (e.g. change status of appts)
// 11) for all forms, we need to have drop down menu (e.g. when nurse want to add/delete medicine, it should have a pop up which filters based on nurse input)
// 12) should delete MC table
// 13) style invoice and MC.
// 14) just general styling evreywhere.. icons and shit!
// 15) how can we allow doctors and nurses all to be using it all at once
// 16) allow nurses to see all patients - currently in junk1
// 17) do alers, spinners and shit correctly!

// GO THROUGH EVERY PAGE WORKFLOW AND POTENTIAL BUGS AND HOW TO IMPROVE

// Nurses

// registrations of patients

// if old patient, click on Existing patient, and form will come out to make a new appointment - for this we update appt table only. we search using IC number preferable, and also can do by full name. Here none of it is mandatory, and in the backend, we tell the backend that one of it might not be filled, and based on that, we need to search for that specific user to make appt table.
// once patient is found, patient details will show on the page, and here, we do create appointment endpoint, and then it'll show up in appointments page. Here, we must have date and shit, but by default it is TODAY!

// once patient is found, if at any point the details change, we should have an edit button to change patient details

// steps
// 1. on frontend, in registration page, we need to make request which connects registration anf set appointment
// on backend, we need to combine registration and set appointment
