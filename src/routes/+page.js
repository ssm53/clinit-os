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

// ASPECTS TO DO
// Continue digitapgp – do edit patient details, and edit appointments

// STEPS
//edit appointments
//in appointment paeg, do seperate tab for all appointments. here, do a get request to get all appointments and display it
// next to each of them, you can have an EDIT APPOINTMENT button. - done
// once that is clicked, it will open up modal with all appointement's info prepopulated (patient info is like consult page), notes(prepopulated), treatment plan (prepupulated). edit noets and treatment plan seperaetly.
// patient info part done. now prepopulate notes.
// once those are edited, it will update the prisma schema accordingly
// and if respstatus 200, you will go back to all appontments tab

//ISSUES NOT SOLVED
// 1) change default value of any date time to a better one. now() isnt too great.
// 2) waitingTime field in appointment table - maybe need to change the type
// 3) for appointmensts page, make sure to ensure that even when there is zero data for each waiting, today, dispensary and serving, it doesnt become error.. that means in html, need to ifdispenasryappts && dispeanryappinet. length > 0
// 4) in consultations page.svelte, when doing treatment plan, should do better with form. allow to only input one row, and can add rows. we also need to ensure there is enough fields for medicine in our appointment table. at the moment, we only have 2.
// 5) when we do end consultation, it automatically goes back to queue for doctor to know who is the next patient.  but when it goes back, we hae to reload to see the updated queue. we need it to be autimatically updated.
// 6) in appointment page, just like the above issue, when it reaches 12am, appointments refresh and there is none, and hence there will be an error! need to avoid this
// 7) need to take into account panel patients - from registration to payment
// 8) need to take into account card payments

// ANALYTICS
// 1) calculate waiting time when consulattion starts - (consultstarttme - arrivaltime)
