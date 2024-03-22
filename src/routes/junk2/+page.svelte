<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	// import { delImageSuc, delImageFail } from '../../utils/alert.js';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	// import { getUserTokenFromLocalStorage } from '../../utils/auth';
	import { formatDateTime } from '../utils/date';
	import {
		todayAppts,
		waitingAppts,
		dispensaryAppts,
		showInvoice,
		allAppts,
		bookingAppts,
		appointmentsWaiting
	} from '../stores/store';
	import { writable } from 'svelte/store';

	export let data;
	let invoiceDetails = [];
	export const tempAppointmentID = writable(0);
	export let patientInfo = [];
	export let apptInfo = [];
	export let loading = false; // Add a loading state
	// appointmentsWaiting.set(data.waitingAppointments);
	// console.log(appointmentsWaiting);

	//Table search
	let nameSearch = ''; // This variable will store the user's input for name search
	let patientICSearch = '';
	let filteredTodayAppointments = [];

	function handleNameSearch() {
		// Filter the appointments based on the user's input
		filteredTodayAppointments = data.todayBookingAppointments.filter((appointment) =>
			appointment.patientDetails.name.toLowerCase().includes(nameSearch.toLowerCase())
		);
	}

	// New function to handle Patient IC search
	function handlePatientICSearch() {
		// Filter the appointments based on the user's input for Patient IC
		filteredTodayAppointments = data.todayBookingAppointments.filter((appointment) =>
			appointment.patientIC.toLowerCase().includes(patientICSearch.toLowerCase())
		);
	}

	// function calculateWaitingTime(arrivalTime) {
	// 	const malaysiaTime = DateTime.local().setZone('Asia/Kuala_Lumpur');
	// 	const arrivalDateTime = DateTime.fromISO(arrivalTime);

	// 	// Calculate the waiting time
	// 	const waitingInterval = Interval.fromDateTimes(arrivalDateTime, malaysiaTime);
	// 	const waitingDuration = waitingInterval.toDuration(['hours', 'minutes', 'seconds']);

	// 	// Format the waiting time
	// 	const hours = Math.floor(waitingDuration.as('hours'));
	// 	const minutes = Math.floor(waitingDuration.as('minutes')) % 60;
	// 	const seconds = Math.floor(waitingDuration.as('seconds')) % 60;

	// 	return `${hours}h ${minutes}m ${seconds}s`;
	// }

	function clickToday() {
		waitingAppts.set(false);
		bookingAppts.set(false);
		dispensaryAppts.set(false);
		allAppts.set(false);
		todayAppts.set(true);
	}

	function clickWaiting() {
		dispensaryAppts.set(false);
		bookingAppts.set(false);
		todayAppts.set(false);
		allAppts.set(false);
		waitingAppts.set(true);
	}

	export async function clickDispensary() {
		todayAppts.set(false);
		bookingAppts.set(false);
		waitingAppts.set(false);
		allAppts.set(false);
		dispensaryAppts.set(true);
	}

	export async function clickAll() {
		todayAppts.set(false);
		bookingAppts.set(false);
		waitingAppts.set(false);
		dispensaryAppts.set(false);
		allAppts.set(true);
	}

	export async function clickBooking() {
		todayAppts.set(false);
		waitingAppts.set(false);
		dispensaryAppts.set(false);
		allAppts.set(false);
		bookingAppts.set(true);
	}

	export async function clickDispAndBilling(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/invoice-details/${appointmentID}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// const res = await resp.json();

		if (resp.status == 200) {
			// invoiceDetails = res.invoiceDetails;
			// console.log(res.invoiceDetails);
			// console.log('success');

			const blob = await resp.blob();
			const url = window.URL.createObjectURL(blob);

			// Open the PDF in a new tab or window
			window.open(url, '_blank');
			dispensaryAppts.set(false);
			showInvoice.set(true);
		} else {
			invoiceDetails = [];
		}
	}

	export async function clickCancel(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/cancel-appointment/${appointmentID}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status === 204) {
			console.log('successfully deleted appt');
		} else {
			console.log('did not delete appt');
		}
	}

	export async function clickGoBack() {
		showInvoice.set(false);
		dispensaryAppts.set(true);
	}

	export async function generateMC(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/mc-details/${appointmentID}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status == 200) {
			const blob = await resp.blob();
			const url = window.URL.createObjectURL(blob);

			// Open the PDF in a new tab or window
			window.open(url, '_blank');
			dispensaryAppts.set(false);
			showInvoice.set(true);
		} else {
			invoiceDetails = [];
		}
	}

	export async function generateLetter(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/letter-details/${appointmentID}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status == 200) {
			const blob = await resp.blob();
			const url = window.URL.createObjectURL(blob);

			// Open the PDF in a new tab or window
			window.open(url, '_blank');
			dispensaryAppts.set(false);
			showInvoice.set(true);
		} else {
			invoiceDetails = [];
		}
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

	export async function clickArrived(appointmentID) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/click-arrived/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();

		if (resp.status == 200) {
			console.log('yesss');
		} else {
			console.log('oh noo');
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
			on:click={clickToday}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Today</button
		>
		<button
			on:click={clickBooking}
			class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
			>Booking</button
		>
	</div>
</div>
<div>
	{#if $waitingAppts}
		{#if data.waitingAppointments.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>
							<th class="border border-gray-400 px-4 py-2">Doctor</th>
							<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name"
								bind:value={nameSearch}
								on:input={handleNameSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Patient IC"
								bind:value={patientICSearch}
								on:input={handlePatientICSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each data.waitingAppointments.filter((waiting) => waiting.patientDetails.name
									.toLowerCase()
									.includes(nameSearch.toLowerCase()) && waiting.patientIC
									.toLowerCase()
									.includes(patientICSearch.toLowerCase())) as waiting}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{waiting.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.reason}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.doctor}</td>
								<td class="border border-gray-400 px-4 py-2"
									>{formatDateTime(waiting.arrivalTime)}</td
								>
								<!-- <td class="border border-gray-400 px-4 py-2"
								>{calculateWaitingTime(waiting.arrivalTime)}</td
							> -->
								<td class="border border-gray-400 px-4 py-2">{waiting.status}</td>
								<td class="border border-gray-400 px-4 py-2">
									<button class=" bg-blue-200" on:click={() => clickCancel(waiting.id)}
										>CANCEL</button
									>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p>No Appointments which are waiting</p>
		{/if}
	{:else if $dispensaryAppts}
		{#if data.dispensaryAppointments.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>
							<th class="border border-gray-400 px-4 py-2">Doctor</th>
							<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
							<th class="border border-gray-400 px-4 py-2">Actions</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name"
								bind:value={nameSearch}
								on:input={handleNameSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Patient IC"
								bind:value={patientICSearch}
								on:input={handlePatientICSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each data.dispensaryAppointments.filter((dispensary) => dispensary.patientDetails.name
									.toLowerCase()
									.includes(nameSearch.toLowerCase()) && dispensary.patientIC
									.toLowerCase()
									.includes(patientICSearch.toLowerCase())) as dispensary}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.reason}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.doctor}</td>
								<td class="border border-gray-400 px-4 py-2"
									>{formatDateTime(dispensary.arrivalTime)}</td
								>
								<td class="border border-gray-400 px-4 py-2">{dispensary.status}</td>
								<td class="border border-gray-400 px-4 py-2">
									<button class=" bg-blue-200" on:click={() => clickDispAndBilling(dispensary.id)}
										>DISPENSE AND BILLING</button
									>
									<button class=" bg-pink-200" on:click={() => clickCancel(dispensary.id)}
										>CANCEL</button
									>
									{#if dispensary.mcDetails != null}
										<button class="bg-green-200" on:click={() => generateMC(dispensary.id)}
											>Generate MC</button
										>
									{/if}
									{#if dispensary.letterDetails != null && dispensary.letterDetails !== 'null'}
										<button class="bg-purple-200" on:click={() => generateLetter(dispensary.id)}
											>Generate Letter</button
										>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p>No appointments ready for payment and dispensary</p>
		{/if}
	{:else if $allAppts}
		{#if data.allAppointments.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>
							<th class="border border-gray-400 px-4 py-2">Doctor</th>
							<th class="border border-gray-400 px-4 py-2">Date</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name or Patient IC"
								bind:value={nameSearch}
								on:input={handleNameSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each data.allAppointments.filter((all) => all.patientDetails.name
									.toLowerCase()
									.includes(nameSearch.toLowerCase()) && all.patientIC
									.toLowerCase()
									.includes(patientICSearch.toLowerCase())) as all}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{all.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{all.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{all.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{all.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{all.reason}</td>
								<td class="border border-gray-400 px-4 py-2">{all.doctor}</td>
								<td class="border border-gray-400 px-4 py-2">{formatDateTime(all.arrivalTime)}</td>
								<td class="border border-gray-400 px-4 py-2">{all.status}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p>There are no appointments at all!</p>
		{/if}
	{:else if $todayAppts}
		{#if data.todayBookingAppointments.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>
							<th class="border border-gray-400 px-4 py-2">Doctor</th>
							<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
							<th class="border border-gray-400 px-4 py-2">Actions</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name"
								bind:value={nameSearch}
								on:input={handleNameSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Patient IC"
								bind:value={patientICSearch}
								on:input={handlePatientICSearch}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each filteredTodayAppointments.length > 0 ? filteredTodayAppointments : data.todayBookingAppointments as today}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{today.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{today.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{today.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{today.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{today.reason}</td>
								<td class="border border-gray-400 px-4 py-2">{today.doctor}</td>
								<td class="border border-gray-400 px-4 py-2">{formatDateTime(today.arrivalTime)}</td
								>
								<td class="border border-gray-400 px-4 py-2">{today.status}</td>
								<td class="border border-gray-400 px-4 py-2"
									><button class=" bg-blue-200" on:click={() => clickArrived(today.id)}
										>Arrived</button
									>
									<button class=" bg-green-200" on:click={() => clickCancel(today.id)}
										>CANCEL</button
									></td
								>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p>No pre-booked appointments today!</p>
		{/if}
	{:else if $bookingAppts}
		{#if data.bookingAppointments.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Patient Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Follow-Up Date</th>
							<th class="border border-gray-400 px-4 py-2">Patient Age</th>
							<th class="border border-gray-400 px-4 py-2">Patient Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>
							<th class="border border-gray-400 px-4 py-2">Doctor</th>
							<th class="border border-gray-400 px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each data.bookingAppointments as booking}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{booking.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{formatDateTime(booking.date)}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.reason}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.doctor}</td>
								<td class="border border-gray-400 px-4 py-2">
									<button class=" bg-blue-200" on:click={() => clickCancel(booking.id)}
										>CANCEL</button
									>
								</td></tr
							>
						{/each}
					</tbody>
				</table>
			</div>
		{:else}
			<p>No booking appointments</p>
		{/if}
	{:else if invoiceDetails.length > 0}
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
	{:else}
		<p>No invoices to show</p>
	{/if}
</div>
