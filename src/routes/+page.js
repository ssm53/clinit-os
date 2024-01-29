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

		const resp5 = await fetch(PUBLIC_BACKEND_BASE_URL + '/get-follow-up-details');
		const res5 = await resp5.json();

		return {
			todayBookingAppointments: res.appointmentsBookingToday,
			waitingAppointments: res2.appointmentsWaiting,
			dispensaryAppointments: res3.appointmentsDispensary,
			allAppointments: res4.appointmentsAll,
			followUpDetails: res5.followUpDetails
		};
	} else {
		return {
			todayBookingAppointments: [],
			waitingAppointments: [],
			dispensaryAppointments: [],
			allAppointments: [],
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
// 18) since now, we dont just do walkin appts, maybe dont need to put doctor field when we craete appts.. also, then we dont need analytics per dr.
// 20) need to change the way time is shown on browser.
// 21) ensure auth for doctors and nurses. they can only access diff sections. have to change database for this. make sure do redirect if not login etc.
//22) forecast where things can go wrong, and send warning! e.g. automatically alert them if a booking happenes, and there was a no show. delete/text?
// - for edit page, the rows must be of constant size, and if got overflow, users can click see more button. basically make rows constant no matter what. stylist can do.
// when editingcompleted appointments in edit tab, there is a normal form, but for them to edit documents, needs to be more detailed eg delete document/ add document. should be able to filter kaw2 for dates, e.g. appts this month, today, yesterday, this week. for mc and referral letter, we can have fields, but we also need to store it in documents field in appts
// refactor forms and make it into a component to be imported.. // here, docs will upload any pdf's they want to be part of documents - also can be as many as they want.
// need to arrange consultations page and show patient history properly!
// design consultations page
// in apps page, no need today and follow up

// GO THROUGH EVERY PAGE WORKFLOW AND POTENTIAL BUGS AND HOW TO IMPROVE

// storing images - fix backend! why is the no credentials thingy showing continously? - ask KK
// ensure styling of invoice and MC to be as like what we want

//now doing
// accurate error handling
// important for all IC's!
// important that email cannot be the same
