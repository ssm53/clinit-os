import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';

export async function load({ fetch }) {
	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/all-patients');

	const res = await resp.json();
	if (resp.status == 200) {
		return {
			patients: res.allPatients
		};
	} else {
		return {
			patients: []
		};
	}
}

// CURRENTLY DOING
// 7. Write referrals and MC's
// - doctor able to type out referral letter and MC during consultation

// 1. have a button that says generate MC in consultation page - done
// 2a. create new field of MC in appointments table (should have appointment ID, IC, name, MCStart, MCEnd, employer, reason ) - done
// 2. once that is clicked, new Modal pops up with a form (name, MCstart, MCEnd, employer, reason). that modal should have a cancel and submit button. if cancel, it closes the modal and returns to normal consultation page. if submit, it populates the MC table with those fields. - done
// 3. then once that is done, in the appointpemts page, if there is an MC for that appointment field, we should have MC button next to dispense and billing. If it is clicked, MC is generated just like how we did with invoice. But here our MC must have pregenerated text e.g. employer: {details.employer} shows employer: 9loop.

// THINGS TO DO

// 1. Create invoice and receipt at appointments page - (ALMOST DONE)
// - create invoice with details from the backend appointments table, together with styling and logo
// - then be able to download/print invoice
// - be able to save that invoice in database (NOT DONE)

// 2. Send automated whatsapp messages
// - send automated whatsapp messages to remind follow updated, various promos
// - send automated whatsapp message to get them to google review

// 3. Payments
// - cash can be done with our current way
// - how to link up card payment, e-wallet
// - must automatically link up to our database as paid

// 4. Panel patients
// - figure out what needs to be known for panel patients
// - might need to alter database here

// 5. Patient history
// - upload and store pdf and images for patient history (same way as recepits and invoices la)

// 6. analytics
// - get sales, purchase and other analytics data
// - must display them properly in a systematic way where you can filter them out easily

// 7. Write referrals and MC's
// - doctor able to type out referral letter and MC during consultation

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
