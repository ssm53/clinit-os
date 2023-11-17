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
//In notepad page, need a button to say ‘start consultation’. - done
//This then starts timer for consultation, and updates the start_consult_time and waiting time in the appointment table.
//This will also change the status of this appointment to serving.
//Then we will also need a end consultation button,
//and this will update consult_end_time in appointment table
//and also change status of appointment to dispensary

// STEPS
//This then starts timer for consultation, and updates the start_consult_time and waiting time in the appointment table.
// need to add waiting time field in appointments - done
// do start consultation function - update consult_start_time and waiting time = consultstarttime - arrival time. the status also should be changed to serving
