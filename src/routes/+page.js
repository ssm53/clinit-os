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
//	Need to do treatment plan section

// STEPS
// - think about how you want to do treatment plan
// so we do a special type of form where for each meds given, there are 3 categories - name of meds, quantity, and notes - done
// add 2 medicine fields (medName1, quantity1, notes1), medName 2 etc. - done
// so do special form where for each meds given and when submitted, info from form is added to appointment table.
// once consultation ends in end-consultation endpoint, it automatically goes back to see the queue and that patient should be gone

//ISSUES NOT SOLVED
// 1) change default value of any date time to a better one. now() isnt too great.
// 2) waitingTime field in appointment table - maybe need to change the type
// 3) for appointmensts page, make sure to ensure that even when there is zero data for each waiting, today, dispensary and serving, it doesnt become error.. that means in html, need to ifdispenasryappts && dispeanryappinet. length > 0
// 4) in consultations page.svelte, when doing treatment plan, should do better with form. allow to only input one row, and can add rows. we also need to ensure there is enough fields for medicine in our appointment table. at the moment, we only have 2.
// 5) when we do end consultation, it automatically goes back to queue for doctor to know who is the next patient.  but when it goes back, we hae to reload to see the updated queue. we need it to be autimatically updated.
// 6) in appointment page, just like the above issue, when it reaches 12am, appointments refresh and there is none, and hence there will be an error! need to avoid this

// ANALYTICS
// 1) calculate waiting time when consulattion starts - (consultstarttme - arrivaltime)
