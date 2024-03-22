import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
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

// 5. analytics
// - get sales, purchase and other analytics data
// - must display them properly in a systematic way where you can filter them out easily

// 6. Create records
// not like analytics, but just pure tables for sales and purchases.

// Inventory
// better way of doing inventory  sorta done

// timetable

// 7. Miscellaneous

// make everyting reactive - dont need to reload
// 11) for all forms, we need to have drop down menu (e.g. when nurse want to add/delete medicine, it should have a pop up which filters based on nurse input)
// 12) should delete MC table
// 13) style invoice and MC. and general styling, layout, icons, dropdown menu etc
// 17) do accurate error handling! - then show correct alerts
// 21) ensure auth for doctors and nurses. they can only access diff sections. have to change database for this. make sure do redirect if not login etc.
//22) forecast where things can go wrong, and send warning! e.g. automatically alert them if a booking happenes, and there was a no show. delete/text?
// - for edit page, the rows must be of constant size, and if got overflow, users can click see more button. basically make rows constant no matter what. stylist can do.
// when editingcompleted appointments in edit tab, there is a normal form, but for them to edit documents, needs to be more detailed eg delete document/ add document. should be able to filter kaw2 for dates, e.g. appts this month, today, yesterday, this week. for mc and referral letter, we can have fields, but we also need to store it in documents field in appts
// refactor forms and make it into a component to be imported.. // here, docs will upload any pdf's they want to be part of documents - also can be as many as they want.
// need to arrange consultations page and show patient history properly!
// design consultations page
// in apps page, no need today and follow up
// same ic and email cannot - do for newpatientbooking and editpatientdetails in registration page
// style consultation page, and ensure when doc link is clicked, it brings us to a new page w that document. also instead of showing whole link, just put an icon or something!
// in queue consultation page, fix the waitingTime as some are NaN
// ensure to store receipt in aws as well in a receipts database
// able to right click and open in new tab for some shits

// REACTIVITY

// managed to show appoitments deleted,
// BUT UNABLE TO REACTIVELY SHOW changes between components
// e.g. register patient reactively shows as waitingAppointments in /+page.svelte
