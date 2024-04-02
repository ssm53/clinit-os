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
		appointmentsWaiting,
		appointmentsDispensary,
		appointmentsToday,
		appointmentsBooking,
		paymentMethod
	} from '../stores/store';
	import { writable } from 'svelte/store';

	export let data;
	let invoiceDetails = [];
	export const tempAppointmentID = writable(0);
	export let patientInfo = [];
	export let apptInfo = [];
	export let loading = false; // Add a loading state

	appointmentsWaiting.set(data.waitingAppointments);
	appointmentsDispensary.set(data.dispensaryAppointments);
	appointmentsToday.set(data.todayBookingAppointments);
	appointmentsBooking.set(data.bookingAppointments);

	//Table search
	let nameSearchWaiting = ''; // This variable will store the user's input for name search
	let patientICSearchWaiting = '';
	let nameSearchDispensary = ''; // This variable will store the user's input for name search
	let patientICSearchDispensary = '';
	let nameSearchAll = ''; // This variable will store the user's input for name search
	let nameSearchToday = ''; // This variable will store the user's input for name search
	let patientICSearchToday = '';

	let filteredTodayAppointments = [];

	function handleNameSearchToday() {
		// Filter the appointments based on the user's input
		filteredTodayAppointments = appointmentsToday.filter((appointment) =>
			appointment.patientDetails.name.toLowerCase().includes(nameSearch.toLowerCase())
		);
	}

	// New function to handle Patient IC search
	function handlePatientICSearchToday() {
		// Filter the appointments based on the user's input for Patient IC
		filteredTodayAppointments = appointmentsToday.filter((appointment) =>
			appointment.patientIC.toLowerCase().includes(patientICSearch.toLowerCase())
		);
	}

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

	export async function displayInvoice(appointmentID) {
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

	export async function clickCancel(appointmentID, type) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/cancel-appointment/${appointmentID}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status === 204) {
			if (type == 'waiting') {
				// Remove the canceled appointment from the waitingAppointments store
				appointmentsWaiting.update((appointments) =>
					appointments.filter((appointment) => appointment.id !== appointmentID)
				);
				console.log('successfully deleted appt');
			} else if (type == 'dispensary') {
				// Remove the canceled appointment from the waitingAppointments store
				appointmentsDispensary.update((appointments) =>
					appointments.filter((appointment) => appointment.id !== appointmentID)
				);
			} else if (type == 'today') {
				// Remove the canceled appointment from the waitingAppointments store
				appointmentsToday.update((appointments) =>
					appointments.filter((appointment) => appointment.id !== appointmentID)
				);
			} else {
				appointmentsBooking.update((appointments) =>
					appointments.filter((appointment) => appointment.id !== appointmentID)
				);
			}
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
		} else {
			invoiceDetails = [];
		}
	}

	function selectPaymentMethod(evt) {
		const method = evt.target.value;
		paymentMethod.set(method);
	}

	async function clickPaid(appointmentID) {
		let tempPaymentMethod;

		// Subscribe to the currentPatientIC store to get its value
		paymentMethod.subscribe((value) => (tempPaymentMethod = value));
		const formData = {
			paymentMethod: tempPaymentMethod
		};
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/click-paid/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		if (resp.status === 200) {
			console.log('success');
			appointmentsDispensary.update((appointments) =>
				appointments.filter((appointment) => appointment.id !== appointmentID)
			);
			paymentMethod.set('cash');
		} else {
			// Handle errors here
			console.log('oh nooo');
			paymentMethod.set('cash');
		}
	}

	// export async function clickPaid(appointmentID) {
	// 	let tempPaymentMethod;

	// 	// Subscribe to the currentPatientIC store to get its value
	// 	paymentMethod.subscribe((value) => (tempPaymentMethod = value));
	// 	let formData = {
	// 		paymentMethod: tempPaymentMethod
	// 	};
	// 	const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/click-paid/${appointmentID}`, {
	// 		method: 'POST',
	// 		mode: 'cors',
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		body: JSON.stringify(formData)
	// 	});

	// 	if (resp.status == 200) {
	// 		console.log('success');
	// 		appointmentsDispensary.update((appointments) =>
	// 			appointments.filter((appointment) => appointment.id !== appointmentID)
	// 		);
	// 	} else {
	// 		// do some error handling here
	// 		console.log('oh nooo');
	// 	}
	// }

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
	class=" top-container flex flex-col justify-center items-center border-b-2 border-black bg-white h-44"
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
		{#if $appointmentsWaiting.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>

							<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name"
								bind:value={nameSearchWaiting}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Patient IC"
								bind:value={patientICSearchWaiting}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each $appointmentsWaiting.filter((waiting) => waiting.patientDetails.name
									.toLowerCase()
									.includes(nameSearchWaiting.toLowerCase()) && waiting.patientIC
									.toLowerCase()
									.includes(patientICSearchWaiting.toLowerCase())) as waiting}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{waiting.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{waiting.reason}</td>

								<td class="border border-gray-400 px-4 py-2"
									>{formatDateTime(waiting.arrivalTime)}</td
								>
								<!-- <td class="border border-gray-400 px-4 py-2"
								>{calculateWaitingTime(waiting.arrivalTime)}</td
							> -->
								<td class="border border-gray-400 px-4 py-2">{waiting.status}</td>
								<td class="border border-gray-400 px-4 py-2">
									<button class=" bg-blue-200" on:click={() => clickCancel(waiting.id, 'waiting')}
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
		{#if $appointmentsDispensary.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>

							<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
							<th class="border border-gray-400 px-4 py-2">Actions</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name"
								bind:value={nameSearchDispensary}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Patient IC"
								bind:value={patientICSearchDispensary}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each $appointmentsDispensary.filter((dispensary) => dispensary.patientDetails.name
									.toLowerCase()
									.includes(nameSearchDispensary.toLowerCase()) && dispensary.patientIC
									.toLowerCase()
									.includes(patientICSearchDispensary.toLowerCase())) as dispensary}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{dispensary.reason}</td>

								<td class="border border-gray-400 px-4 py-2"
									>{formatDateTime(dispensary.arrivalTime)}</td
								>
								<td class="border border-gray-400 px-4 py-2">{dispensary.status}</td>
								<td class="border border-gray-400 px-4 py-2">
									<button class=" bg-blue-200" on:click={() => displayInvoice(dispensary.id)}
										>Invoice</button
									>
									<select
										id="paymentMethodSelect"
										class="bg-blue-200"
										on:change={(evt) => selectPaymentMethod(evt)}
									>
										<option value="cash">Cash</option>
										<option value="card/transfer">Card/Transfer</option>
										<option value="panel">Panel</option>
									</select>
									<button class=" bg-blue-200" on:click={() => clickPaid(dispensary.id)}
										>PAID</button
									>
									<!-- // i have this button, but instead of just showing paid, i need to have three options - cash, card/transfer and panel.. if either one of those is clicked, it updaes the paymentMethod store to either cash, card/transfer or panel -->

									<button
										class=" bg-pink-200"
										on:click={() => clickCancel(dispensary.id, 'dispensary')}>CANCEL</button
									>
									{#if dispensary.mcDetails != null && dispensary.letterDetails !== 'null'}
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

							<th class="border border-gray-400 px-4 py-2">Date</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name or Patient IC"
								bind:value={nameSearchAll}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each data.allAppointments.filter((all) => all.patientDetails.name
								.toLowerCase()
								.includes(nameSearchAll.toLowerCase())) as all}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{all.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{all.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{all.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{all.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{all.reason}</td>

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
		{#if $appointmentsToday.length > 0}
			<div>
				<table class="border-collapse w-full">
					<thead>
						<tr>
							<th class="border border-gray-400 px-4 py-2">Name</th>
							<th class="border border-gray-400 px-4 py-2">Patient IC</th>
							<th class="border border-gray-400 px-4 py-2">Age</th>
							<th class="border border-gray-400 px-4 py-2">Gender</th>
							<th class="border border-gray-400 px-4 py-2">Reason</th>

							<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
							<th class="border border-gray-400 px-4 py-2">Status</th>
							<th class="border border-gray-400 px-4 py-2">Actions</th>
						</tr>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Name"
								bind:value={nameSearchToday}
								on:input={handleNameSearchToday}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
						<th class="border border-gray-400 px-4 py-2">
							<input
								type="text"
								placeholder="Search by Patient IC"
								bind:value={patientICSearchToday}
								on:input={handlePatientICSearchToday}
								class="block w-full rounded-md py-2 px-3 border border-gray-300"
							/>
						</th>
					</thead>
					<tbody>
						{#each filteredTodayAppointments.length > 0 ? filteredTodayAppointments : $appointmentsToday as today}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{today.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{today.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{today.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{today.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{today.reason}</td>

								<td class="border border-gray-400 px-4 py-2">{formatDateTime(today.arrivalTime)}</td
								>
								<td class="border border-gray-400 px-4 py-2">{today.status}</td>
								<td class="border border-gray-400 px-4 py-2"
									><button class=" bg-blue-200" on:click={() => clickArrived(today.id)}
										>Arrived</button
									>
									<button class=" bg-green-200" on:click={() => clickCancel(today.id, 'today')}
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
		{#if $appointmentsBooking.length > 0}
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

							<th class="border border-gray-400 px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each $appointmentsBooking as booking}
							<tr class="hover:bg-gray-100">
								<td class="border border-gray-400 px-4 py-2">{booking.patientDetails.name}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.patientIC}</td>
								<td class="border border-gray-400 px-4 py-2">{formatDateTime(booking.date)}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.patientDetails.age}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.patientDetails.gender}</td>
								<td class="border border-gray-400 px-4 py-2">{booking.reason}</td>

								<td class="border border-gray-400 px-4 py-2">
									<button class=" bg-blue-200" on:click={() => clickCancel(booking.id, 'booking')}
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
	{/if}
</div>
