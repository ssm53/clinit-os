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
// in consultation page, by default it is the queue (this is in a modal)
// once click one of the patients, a new modal opens which shows the profile of patient, history of patient, notepad, and diagnosis (follow clinicOS here)

// STEPS
// in consultation page, by default it is the queue (this is in a modal)
// create stores for it, create modal, and do hidden or not hidden buttons
