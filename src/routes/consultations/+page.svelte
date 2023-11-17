<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	// import { delImageSuc, delImageFail } from '../../utils/alert.js';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	import { DateTime, Interval } from 'luxon';
	import { writable } from 'svelte/store';

	export let data;

	export let partPatientInfo = [];
	let patientHistory = [];
	export let loading = false; // Add a loading state

	export const queue = writable(true);
	export const notepad = writable(false);
	// Add patientIC to writable store
	export const currentPatientIC = writable('');
	export const currentAppointmentID = writable('');

	function calculateWaitingTime(arrivalTime) {
		const malaysiaTime = DateTime.local().setZone('Asia/Kuala_Lumpur');
		const arrivalDateTime = DateTime.fromISO(arrivalTime);

		// Calculate the waiting time
		const waitingInterval = Interval.fromDateTimes(arrivalDateTime, malaysiaTime);
		const waitingDuration = waitingInterval.toDuration(['hours', 'minutes', 'seconds']);

		// Format the waiting time
		const hours = Math.floor(waitingDuration.as('hours'));
		const minutes = Math.floor(waitingDuration.as('minutes')) % 60;
		const seconds = Math.floor(waitingDuration.as('seconds')) % 60;

		return `${hours}h ${minutes}m ${seconds}s`;
	}

	export async function viewAppointment(patientIC, appointmentID) {
		// Set the patientIC to the writable store
		currentPatientIC.set(patientIC);
		currentAppointmentID.set(appointmentID);

		queue.set(false);
		notepad.set(true);

		// Call the getPartPatientInfo function to fetch patient details
		await getPartPatientInfo(patientIC);
		await getPatientHistory(patientIC);
	}

	export async function getPartPatientInfo() {
		let patientIC;

		// Subscribe to the currentPatientIC store to get its value
		currentPatientIC.subscribe((value) => (patientIC = value));
		console.log(patientIC);
		// Set loading to true while fetching data
		loading = true;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/part-patient-info/${patientIC}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			partPatientInfo = res.partPatientInfo;
			// Set loading back to false after fetching completes
			loading = false;
		} else {
			partPatientInfo = [];
			// Set loading back to false after fetching completes
			loading = false;
		}
	}

	export async function seeQueue() {
		queue.set(true);
		notepad.set(false);
	}

	export async function addNotes(evt) {
		let appointmentID;

		// Subscribe to the currentPatientIC store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const notes = {
			notes: evt.target['notes'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/add-notes/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(notes)
		});

		if (resp.status == 200) {
			goto('/appointments');
		} else {
			// do some error handling here
			console.log('oh nooo');
		}
	}

	export async function getPatientHistory() {
		// here need to go a get request for all appointments where patientIC = patientIC
		let patientIC;

		// Subscribe to the currentPatientIC store to get its value
		currentPatientIC.subscribe((value) => (patientIC = value));

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-patient-history/${patientIC}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();

		if (resp.status == 200) {
			console.log('hello');
			patientHistory = res.patientHistory;
		} else {
			console.log('hello2');
			patientHistory = [];
		}
	}

	export async function startConsultation() {
		// some code
		// here we want to update start consult time and get waiting time calculated
		let appointmentID;

		// Subscribe to the currentPatientIC store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/start-consultation/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();

		if (resp.status == 200) {
			console.log('success');
		} else {
			console.log('fail');
		}
	}
</script>

<div>
	{#if $queue}
		<p>Queue</p>
		<!-- MODAL 1 -->
		<div class=" w-screen flex-col filter-box bg-white">
			{#each data.waitingAppointments as waiting}
				<div class="flex flex-row">
					<p>{waiting.patientDetails.name}</p>
					<p>{waiting.patientDetails.age}</p>
					<p>{waiting.patientDetails.gender}</p>
					<p>{waiting.patientIC}</p>
					<p>{waiting.reason}</p>
					<p>{waiting.doctor}</p>
					<p>{waiting.arrivalTime}</p>
					<p>{calculateWaitingTime(waiting.arrivalTime)}</p>
					<p>{waiting.status}</p>
					<button on:click={() => viewAppointment(waiting.patientIC, waiting.id)}
						>View Appointment</button
					>
				</div>
			{/each}
		</div>
	{:else}
		<!-- MODAL 2 -->
		<div class=" w-screen flex-col filter-box2 bg-white">
			<button on:click={seeQueue}>See Queue</button>
			<div class=" left-container flex flex-col">
				<div class=" patient-info border-2">
					<p>Patient Info</p>
					{#if partPatientInfo.length > 0}
						<div class="flex flex-row">
							<p>{partPatientInfo[0].name}</p>
							<p>{partPatientInfo[0].IC}</p>
							<p>{partPatientInfo[0].gender}</p>
							<p>{partPatientInfo[0].age}</p>
						</div>
					{:else}
						<p>Loading...</p>
					{/if}
				</div>
				<div class="notepad">
					<form on:submit|preventDefault={addNotes} class="w-1/2 bg-white shadow-md rounded-lg p-8">
						<div class="mb-6">
							<label for="notes" class="block text-gray-700 text-sm font-bold mb-2"> Notes </label>
							<input
								type="text"
								name="notes"
								placeholder="Enter something"
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>

							<div class="flex justify-end">
								<button
									class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
									type="submit"
								>
									Add Notes
								</button>
							</div>
						</div>
					</form>
				</div>
				<div class="treatment-plan">
					<p>treatment plan</p>
				</div>
			</div>
			<div class=" patient-history right-container">
				<p>Patient History</p>
				{#each patientHistory as history}
					<div>
						<p>{history.date}</p>
						<p>{history.doctor}</p>
						<p>{history.status}</p>
						<p>{history.notes}</p>
					</div>
				{/each}
			</div>
			<button on:click={startConsultation}>Call Patient In</button>
		</div>
	{/if}
</div>
