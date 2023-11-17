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
	export let loading = false; // Add a loading state

	export const queue = writable(true);
	export const notepad = writable(false);
	// Add patientIC to writable store
	export const currentPatientIC = writable('');

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

	export async function seeDetails(patientIC) {
		// Set the patientIC to the writable store
		currentPatientIC.set(patientIC);
		console.log(currentPatientIC);

		queue.set(false);
		notepad.set(true);

		// Call the getPartPatientInfo function to fetch patient details
		await getPartPatientInfo(patientIC);
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
					<button on:click={seeDetails(waiting.patientIC)}>See details</button>
				</div>
			{/each}
		</div>
	{:else}
		<!-- MODAL 2 -->
		<div class=" w-screen flex-col filter-box2 bg-white">
			<div class=" left-container flex flex-col">
				<div class=" patient-info">
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
					<p>notepad</p>
				</div>
				<div class="treatment-plan">
					<p>treatment plan</p>
				</div>
			</div>
			<div class=" patient-history right-container">
				<p>patient history</p>
			</div>
		</div>
	{/if}
</div>
