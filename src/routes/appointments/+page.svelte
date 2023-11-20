<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	// import { delImageSuc, delImageFail } from '../../utils/alert.js';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	import {
		todayAppts,
		waitingAppts,
		dispensaryAppts,
		showInvoice,
		allAppts,
		followUpAppts
	} from '../../stores/store';
	import { DateTime, Interval } from 'luxon';
	import { writable } from 'svelte/store';

	export let data;
	let invoiceDetails = [];
	export const tempAppointmentID = writable(0);
	export let patientInfo = [];
	export let apptInfo = [];
	export let loading = false; // Add a loading state

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

	function clickToday() {
		waitingAppts.set(false);
		followUpAppts.set(false);
		dispensaryAppts.set(false);
		allAppts.set(false);
		todayAppts.set(true);
	}

	function clickWaiting() {
		dispensaryAppts.set(false);
		followUpAppts.set(false);
		todayAppts.set(false);
		allAppts.set(false);
		waitingAppts.set(true);
	}

	export async function clickDispensary() {
		todayAppts.set(false);
		followUpAppts.set(false);
		waitingAppts.set(false);
		allAppts.set(false);
		dispensaryAppts.set(true);
	}

	export async function clickAll() {
		todayAppts.set(false);
		followUpAppts.set(false);
		waitingAppts.set(false);
		dispensaryAppts.set(false);
		allAppts.set(true);
	}

	export async function clickFollowUp() {
		todayAppts.set(false);
		waitingAppts.set(false);
		dispensaryAppts.set(false);
		allAppts.set(false);
		followUpAppts.set(true);
	}

	export async function clickDispAndBilling(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/invoice-details/${appointmentID}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();

		if (resp.status == 200) {
			invoiceDetails = res.invoiceDetails;
			console.log(res.invoiceDetails);
			console.log('success');
			dispensaryAppts.set(false);
			showInvoice.set(true);
		} else {
			invoiceDetails = [];
		}
	}

	export async function clickGoBack() {
		showInvoice.set(false);
		dispensaryAppts.set(true);
	}

	export async function clickPaid(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/click-paid/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status == 200) {
			console.log('success');
		} else {
			// do some error handling here
			console.log('oh nooo');
		}
	}

	export async function clickEditAppt(id, ic) {
		tempAppointmentID.set(id);
		await getPatientInfo(ic);
		await getApptInfo(id);
		let hiddenModal = document.querySelector('.filter-box');
		hiddenModal.classList.remove('hidden');
		// need to await get function, which we will then show in the modal (in there must have (id))
	}

	export async function getPatientInfo(ic) {
		// Set loading to true while fetching data
		loading = true;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-patient-info/${ic}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			patientInfo = res.patientInfo;
			// Set loading back to false after fetching completes
			loading = false;
		} else {
			patientInfo = [];
			// Set loading back to false after fetching completes
			loading = false;
		}
	}

	export async function getApptInfo(id) {
		// Set loading to true while fetching data
		loading = true;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-appt-info/${id}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			apptInfo = res.apptInfo;
			// Set loading back to false after fetching completes
			loading = false;
		} else {
			apptInfo = [];
			// Set loading back to false after fetching completes
			loading = false;
		}
	}

	export async function closeEditModal() {
		let hiddenModal = document.querySelector('.filter-box');
		hiddenModal.classList.add('hidden');
	}

	export async function editNotes(evt) {
		// some code
		// loading.set(true);
		// // loading.update((value) => {
		// //   return true
		// // })
		let id;

		tempAppointmentID.subscribe((value) => (id = value));

		const editApptData = {
			// name, IC, age, gender, email, contact, race
			notes: evt.target['notes'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/edit-notes/${id}`, {
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: sellerToken
				// need onre more which is authorisation - for that the value will be the token when youre signed in
			},
			body: JSON.stringify(editApptData)
		});

		const res = await resp.json();

		if (resp.status === 200) {
			// loading.set(false);
			// loading.update((value) => {
			// 	return false;
			// });
			// closeEditDetailsModal();
			// console.log('formErrors:', formErrors);
			console.log('sucess');
		} else {
			// loading.set(false);
			// // loading.update((value) => {
			// // 	return false;
			// // });
			// const res = await resp.json();
			// formErrors = res.data;
			// // showEditAlert();
			console.log('something went wrong there matey');
		}
	}

	export async function editTreatmentPlan(evt) {
		// loading.set(true);
		// // loading.update((value) => {
		// //   return true
		// // })
		let id;

		tempAppointmentID.subscribe((value) => (id = value));

		const editApptData = {
			meds1: evt.target['meds1'].value,
			quantity1: parseInt(evt.target['quantity1'].value),
			notes1: evt.target['notes1'].value,
			meds2: evt.target['meds2'].value,
			quantity2: parseInt(evt.target['quantity2'].value),
			notes2: evt.target['notes2'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/edit-treatment-plan/${id}`, {
			method: 'PATCH',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: sellerToken
				// need onre more which is authorisation - for that the value will be the token when youre signed in
			},
			body: JSON.stringify(editApptData)
		});

		const res = await resp.json();

		if (resp.status === 200) {
			// loading.set(false);
			// loading.update((value) => {
			// 	return false;
			// });
			// closeEditDetailsModal();
			// console.log('formErrors:', formErrors);
			console.log('success');
		} else {
			// loading.set(false);
			// // loading.update((value) => {
			// // 	return false;
			// // });
			// const res = await resp.json();
			// formErrors = res.data;
			// // showEditAlert();
			console.log('something went wrong there matey');
		}
	}
</script>

<div
	class="top-container flex flex-col justify-center items-center border-b-2 border-black bg-white h-44"
>
	<div>
		<span class="font-bold text-3xl text-pink-700">Appointments</span>
	</div>
	<div class="flex flex-row justify-between mt-5">
		<button
			on:click={clickToday}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Today</button
		>
		<button
			on:click={clickWaiting}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Waiting</button
		>
		<button
			on:click={clickDispensary}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Dispensary</button
		>
		<button
			on:click={clickAll}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>All</button
		>
		<button
			on:click={clickFollowUp}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Follow Up</button
		>
	</div>
</div>
<div>
	{#if $todayAppts}
		{#if data.todayAppointments.length > 0}
			<div>
				{#each data.todayAppointments as today}
					<div class="flex flex-row">
						<p>{today.patientDetails.name}</p>
						<p>{today.patientDetails.age}</p>
						<p>{today.patientDetails.gender}</p>
						<p>{today.patientIC}</p>
						<p>{today.reason}</p>
						<p>{today.doctor}</p>
						<p>{today.arrivalTime}</p>
						<p>{today.status}</p>
					</div>
				{/each}
			</div>
		{:else}
			<p>nothing to show matey</p>
		{/if}
	{:else if $waitingAppts}
		<div>
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
				</div>
			{/each}
		</div>
	{:else if $dispensaryAppts}
		<div>
			{#each data.dispensaryAppointments as dispensary}
				<div class="flex flex-row">
					<p>{dispensary.patientDetails.name}</p>
					<p>{dispensary.patientDetails.age}</p>
					<p>{dispensary.patientDetails.gender}</p>
					<p>{dispensary.patientIC}</p>
					<p>{dispensary.reason}</p>
					<p>{dispensary.doctor}</p>
					<p>{dispensary.arrivalTime}</p>
					<p>{dispensary.status}</p>
					<button on:click={() => clickDispAndBilling(dispensary.id)}>DISPENSE AND BILLING</button>
				</div>
			{/each}
		</div>
	{:else if $allAppts}
		<div>
			{#each data.allAppointments as all}
				<div class="flex flex-row">
					<p>{all.patientDetails.name}</p>
					<p>{all.patientDetails.age}</p>
					<p>{all.patientDetails.gender}</p>
					<p>{all.patientIC}</p>
					<p>{all.reason}</p>
					<p>{all.doctor}</p>
					<p>{all.arrivalTime}</p>
					<p>{all.status}</p>
					<button on:click={() => clickEditAppt(all.id, all.patientDetails.IC)}
						>Edit Appointment</button
					>
				</div>
			{/each}
			<!-- MODAL 3 -->
			<div class=" w-screen flex-col hidden filter-box bg-white">
				<button on:click={closeEditModal()}>Close</button>
				<!-- in here, we put all the appt details -->
				<div class=" left-container flex flex-col">
					<div class=" patient-info border-2">
						<p>Patient Info</p>
						{#if patientInfo.length > 0}
							<div class="flex flex-row">
								<p>{patientInfo[0].name}</p>
								<p>{patientInfo[0].IC}</p>
								<p>{patientInfo[0].gender}</p>
								<p>{patientInfo[0].age}</p>
							</div>
						{:else}
							<p>Loading...</p>
						{/if}
					</div>
				</div>
				<div class="notepad">
					<form
						on:submit|preventDefault={editNotes}
						class="w-1/2 bg-white shadow-md rounded-lg p-8"
					>
						<div class="mb-6">
							<label for="notes" class="block text-gray-700 text-sm font-bold mb-2"> Notes </label>
							<input
								type="text"
								name="notes"
								placeholder="Enter something"
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
								value={apptInfo.length > 0 ? apptInfo[0].notes : ''}
							/>

							<div class="flex justify-end">
								<button
									class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
									type="submit"
								>
									Edit Notes
								</button>
							</div>
						</div>
					</form>
				</div>
				<div class="treatment-plan">
					<p>Treatment Plan</p>
					<form
						on:submit|preventDefault={editTreatmentPlan}
						class="w-1/2 bg-white shadow-md rounded-lg p-8"
					>
						<div class="mb-6 flex justify-between">
							<div class="w-1/3">
								<label for="meds1" class="block text-gray-700 text-sm font-bold mb-2"
									>Medicine</label
								>
								<input
									type="text"
									name="meds1"
									placeholder="Enter medicine"
									class="block w-full rounded-md py-2 px-3 border border-gray-300"
									value={apptInfo.length > 0 ? apptInfo[0].medName1 : ''}
								/>
							</div>
							<div class="w-1/3">
								<label for="quantity1" class="block text-gray-700 text-sm font-bold mb-2"
									>Quantity</label
								>
								<input
									type="number"
									name="quantity1"
									placeholder="Enter quantity"
									class="block w-full rounded-md py-2 px-3 border border-gray-300"
									value={apptInfo.length > 0 ? apptInfo[0].quantity1 : ''}
								/>
							</div>
							<div class="w-1/3">
								<label for="notes1" class="block text-gray-700 text-sm font-bold mb-2">Notes</label>
								<input
									type="text"
									name="notes1"
									placeholder="Enter notes"
									class="block w-full rounded-md py-2 px-3 border border-gray-300"
									value={apptInfo.length > 0 ? apptInfo[0].notes1 : ''}
								/>
							</div>
						</div>
						<div class="mb-6 flex justify-between">
							<div class="w-1/3">
								<label for="meds2" class="block text-gray-700 text-sm font-bold mb-2"
									>Medicine</label
								>
								<input
									type="text"
									name="meds2"
									placeholder="Enter medicine"
									class="block w-full rounded-md py-2 px-3 border border-gray-300"
									value={apptInfo.length > 0 ? apptInfo[0].medName2 : ''}
								/>
							</div>
							<div class="w-1/3">
								<label for="quantity2" class="block text-gray-700 text-sm font-bold mb-2"
									>Quantity</label
								>
								<input
									type="number"
									name="quantity2"
									placeholder="Enter quantity"
									class="block w-full rounded-md py-2 px-3 border border-gray-300"
									value={apptInfo.length > 0 ? apptInfo[0].quantity2 : ''}
								/>
							</div>
							<div class="w-1/3">
								<label for="notes2" class="block text-gray-700 text-sm font-bold mb-2">Notes</label>
								<input
									type="text"
									name="notes2"
									placeholder="Enter notes"
									class="block w-full rounded-md py-2 px-3 border border-gray-300"
									value={apptInfo.length > 0 ? apptInfo[0].notes2 : ''}
								/>
							</div>
						</div>
						<div class="flex justify-end">
							<button
								class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
								type="submit"
							>
								Edit Treatment Plan
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	{:else if $followUpAppts}
		<div>
			{#each data.followUpDetails as fDetails}
				<div class="flex flex-row">
					<p>{fDetails.patientName}</p>
					<p>{fDetails.patientIC}</p>
					<p>{fDetails.patientContact}</p>
					<p>{fDetails.followUpReason}</p>
					<p>{fDetails.followUpDate}</p>
				</div>
			{/each}
		</div>
	{:else}
		<p>hello</p>
		<div>
			{#each invoiceDetails as details}
				<div class="flex flex-row">
					<p>{details.patientIC}</p>
					<p>{details.date}</p>
					<p>{details.reason}</p>
					<p>{details.medName1}</p>
					<p>{details.quantity1}</p>
					<p>{details.notes1}</p>
					<p>{details.medName2}</p>
					<p>{details.quantity2}</p>
					<p>{details.notes2}</p>
					<p>{details.amount}</p>
					<button on:click={() => clickPaid(details.id)}>PAID?</button>
				</div>
			{/each}
			<button on:click={clickGoBack}>Go Back</button>
		</div>
	{/if}
</div>
