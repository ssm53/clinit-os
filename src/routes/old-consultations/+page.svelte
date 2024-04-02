<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	// import { delImageSuc, delImageFail } from '../../utils/alert.js';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getDoctorTokenFromLocalStorage } from '../../utils/auth';
	import { DateTime, Interval } from 'luxon';
	import { writable } from 'svelte/store';
	import { formatDateTime } from '../../utils/date';
	import { seeDocuments, seePastAppointments, seePersonalInfo } from '../../stores/store';

	export let data;

	export let partPatientInfo = [];
	let patientDocuments = [];
	let patientHistory = [];
	export let loading = false; // Add a loading state

	export const queue = writable(true);
	export const notepad = writable(false);
	export const writeMc = writable(false);
	export const writeRefLetter = writable(false);
	// Add patientIC to writable store
	export const currentPatientIC = writable('');
	export const currentAppointmentID = writable('');

	let nameFilter = '';
	let icFilter = '';

	$: filteredAppointments = data.waitingAppointments.filter(
		(appointment) =>
			appointment.patientDetails.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
			appointment.patientIC.toLowerCase().includes(icFilter.toLowerCase())
	);

	// ADDING MORE MEDICINES
	// START
	// Maximum number of medicine rows
	const maxRows = 7;

	// Initial medicine data
	const initialMedicine = [{ meds: '', quantity: '', notes: '' }];

	// Reactive store for medicine data
	const medicineData = writable(initialMedicine);

	// Function to add a new row
	function addMedicineRow() {
		medicineData.update((data) => {
			if (data.length < maxRows) {
				return [...data, { meds: '', quantity: '', notes: '' }];
			}
			return data;
		});
	}

	// Function to delete the most recent row
	function deleteMedicineRow() {
		medicineData.update((data) => {
			if (data.length > 1) {
				// Remove the last element (most recent row)
				data.pop();
			}
			return data;
		});
	}

	//END

	function calculateWaitingTime(arrivalTime) {
		try {
			console.log(arrivalTime);
			// Check if arrivalTime is a valid ISO string
			if (!DateTime.fromISO(arrivalTime).isValid) {
				throw new Error('Invalid arrival time format');
			}

			// Get current time in Malaysia timezone
			const malaysiaTime = DateTime.local().setZone('Asia/Kuala_Lumpur');
			const adjustedTime = malaysiaTime.plus({ hours: 8 });
			const arrivalDateTime = DateTime.fromISO(arrivalTime);

			console.log('Malaysia Time:', malaysiaTime.toString());
			console.log('Arrival Time:', arrivalDateTime.toString());

			// Calculate the waiting time
			const waitingInterval = Interval.fromDateTimes(arrivalDateTime, adjustedTime);
			const waitingDuration = waitingInterval.toDuration(['hours', 'minutes', 'seconds']);
			console.log(waitingDuration);

			// Format the waiting time
			const hours = Math.floor(waitingDuration.as('hours'));
			const minutes = Math.floor(waitingDuration.as('minutes')) % 60;
			const seconds = Math.floor(waitingDuration.as('seconds')) % 60;

			return `${hours}h ${minutes}m ${seconds}s`;
		} catch (error) {
			console.error('Error calculating waiting time:', error.message);
			return 'Error';
		}
	}

	export async function viewAppointment(patientIC, appointmentID) {
		// Set the patientIC to the writable store
		currentPatientIC.set(patientIC);
		currentAppointmentID.set(appointmentID);

		queue.set(false);
		writeMc.set(false);
		notepad.set(true);

		// Call the getPartPatientInfo function to fetch patient details
		await getPartPatientInfo(patientIC);
		await getPatientHistory(patientIC);
		await getPatientDocuments(patientIC);
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
			console.log(partPatientInfo);
			// Set loading back to false after fetching completes
			loading = false;
		} else {
			partPatientInfo = [];
			// Set loading back to false after fetching completes
			loading = false;
		}
	}

	export async function getPatientDocuments() {
		let patientIC;
		currentPatientIC.subscribe((value) => (patientIC = value));
		loading = true;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-documents/${patientIC}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			patientDocuments = res.patientDocuments;
			// Set loading back to false after fetching completes
			loading = false;
		} else {
			patientDocuments = [];
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
			console.log('success');
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

	export async function endConsultation() {
		// here we want to update end consult time, cahnge status to dispensary and get waiting time calculated
		let appointmentID;

		// Subscribe to the currentPatientIC store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/end-consultation/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();

		if (resp.status == 200) {
			queue.set(true);
			console.log('success');
		} else {
			console.log('fail');
		}
	}

	// write MC
	export function openMC() {
		queue.set(false);
		notepad.set(false);
		writeMc.set(true);
	}

	export async function writeMC(evt) {
		let appointmentID;

		// Subscribe to the currentappiintmentID store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const mcDetails = {
			name: evt.target['name'].value,
			reason: evt.target['reason'].value,
			employer: evt.target['employer'].value,
			mcStartDate: DateTime.fromISO(evt.target['mcStart'].value).toISO(),
			mcEndDate: DateTime.fromISO(evt.target['mcEnd'].value).toISO()
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/add-mc-details/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(mcDetails)
		});

		if (resp.status == 200) {
			console.log('success');
			writeMc.set(false);
			queue.set(false);
			notepad.set(true);
		} else if (resp.status == 401) {
			console.log('cannot add mc details');
			// we do an alert that there is not enough medicine for treatment plan
		} else {
			// do some error handling here
			console.log('oh nooo');
		}
	}

	export function closeMC() {
		writeMc.set(false);
		queue.set(false);
		notepad.set(true);
	}

	export function openLetter() {
		queue.set(false);
		notepad.set(false);
		writeRefLetter.set(true);
	}

	export async function writeLetter(evt) {
		let appointmentID;

		// Subscribe to the currentappiintmentID store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));
		// needs just date and textarea
		const letterDetails = {
			letterDate: DateTime.fromISO(evt.target['letter-date'].value).toISO(),
			content: evt.target['content'].value
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/add-letter-details/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(letterDetails)
		});

		if (resp.status == 200) {
			console.log('success');

			queue.set(false);
			writeRefLetter.set(false);
			notepad.set(true);
		} else if (resp.status == 401) {
			console.log('cannot add letter details');
			// we do an alert that there is not enough medicine for treatment plan
		} else {
			// do some error handling here
			console.log('oh nooo');
		}
	}

	export function closeLetter() {
		writeRefLetter.set(false);
		queue.set(false);
		notepad.set(true);
	}

	export async function addTreatmentPlan(evt) {
		let appointmentID;

		// Subscribe to the currentPatientIC store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const formData = $medicineData;
		console.log(formData);

		// const treatmentPlan = {
		// 	meds1: evt.target['meds1'].value,
		// 	quantity1: parseInt(evt.target['quantity1'].value),
		// 	notes1: evt.target['notes1'].value,
		// 	meds2: evt.target['meds2'].value,
		// 	quantity2: parseInt(evt.target['quantity2'].value),
		// 	notes2: evt.target['notes2'].value
		// };

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/add-treatment-plan/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		if (resp.status == 200) {
			console.log('success');
		} else if (resp.status == 401) {
			console.log('not enough meds');
			// we do an alert that there is not enough medicine for treatment plan
		} else {
			// do some error handling here
			console.log('oh nooo');
		}
	}

	export async function addFollowUp(evt) {
		let appointmentID;

		// Subscribe to the currentPatientIC store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const followUpData = {
			followUpReason: evt.target['follow-up-reason'].value,
			followUpDate: DateTime.fromISO(evt.target['date'].value).toISO()
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/add-follow-up/${appointmentID}`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: sellerToken
				// need onre more which is authorisation - for that the value will be the token when youre signed in
			},
			body: JSON.stringify(followUpData)
		});

		const res = await resp.json();

		if (resp.status === 200) {
			console.log('success');
		} else {
			console.log('something went wrong there matey');
		}
	}

	// upload documents
	export async function addDocuments(evt) {
		console.log('yellow');
		// here need to go a get request for all appointments where patientIC = patientIC
		let patientIC;

		// Subscribe to the currentPatientIC store to get its value
		currentPatientIC.subscribe((value) => (patientIC = value));

		let appointmentID;

		// Subscribe to the currentPatientIC store to get its value
		currentAppointmentID.subscribe((value) => (appointmentID = value));

		const fileInput = document.getElementById('file-upload');
		const file = fileInput.files[0];
		const caption = evt.target['caption'].value;
		const IC = patientIC;

		if (file) {
			const formData = new FormData();
			formData.append('file-upload', file);
			formData.append('caption', caption);
			formData.append('IC', IC);
			evt.target.value = null;
			console.log('ok working abit');
			try {
				const addDocs = await fetch(PUBLIC_BACKEND_BASE_URL + `/upload/${appointmentID}`, {
					method: 'POST',
					body: formData
				});
			} catch (error) {
				console.error(error);
			}
		}
	}
</script>

<div>
	{#if $queue}
		<p>Queue</p>
		<!-- MODAL 1 -->
		<div class="w-screen filter-box bg-white">
			<input type="text" bind:value={nameFilter} placeholder="Filter by Name" />
			<input type="text" bind:value={icFilter} placeholder="Filter by IC" />

			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Age</th>
						<th>Gender</th>
						<th>IC</th>
						<th>Reason</th>

						<th>Arrival Time</th>
						<th>Waiting Time</th>
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{#each filteredAppointments as appointment}
						<tr>
							<td>{appointment.patientDetails.name}</td>
							<td>{appointment.patientDetails.age}</td>
							<td>{appointment.patientDetails.gender}</td>
							<td>{appointment.patientIC}</td>
							<td>{appointment.reason}</td>

							<td>{formatDateTime(appointment.arrivalTime)}</td>
							<td>{calculateWaitingTime(appointment.arrivalTime)}</td>
							<td>{appointment.status}</td>
							<td>
								<button on:click={() => viewAppointment(appointment.patientIC, appointment.id)}>
									View Appointment
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if $writeMc}
		<!-- Modal 3 -->
		<div class="write-MC">
			<p>Write MC</p>
			<form on:submit|preventDefault={writeMC} class="w-1/2 bg-white shadow-md rounded-lg p-8">
				<div class="mb-6 flex justify-between">
					<div class="w-1/3">
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
						<input
							type="text"
							name="name"
							placeholder="Enter name"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="w-1/3">
						<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">Reason</label>
						<input
							type="text"
							name="reason"
							placeholder="Enter reason"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="w-1/3">
						<label for="mcStart" class="block text-gray-700 text-sm font-bold mb-2"
							>Start Date</label
						>
						<input
							type="date"
							name="mcStart"
							placeholder="Enter start date of MC"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
				</div>
				<div class="mb-6 flex justify-between">
					<div class="w-1/3">
						<label for="mcEnd" class="block text-gray-700 text-sm font-bold mb-2">End Date</label>
						<input
							type="date"
							name="mcEnd"
							placeholder="Enter end date of MC"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="w-1/3">
						<label for="employer" class="block text-gray-700 text-sm font-bold mb-2">Employer</label
						>
						<input
							type="text"
							name="employer"
							placeholder="Enter employer"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
				</div>
				<div class="flex justify-end">
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit"
					>
						Add MC
					</button>
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						on:click={closeMC}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{:else if $writeRefLetter}
		<!-- Modal 3 -->
		<div
			class="write-letter fixed top-0 left-0 h-screen w-screen flex items-center justify-center bg-gray-500 bg-opacity-50"
		>
			<form on:submit|preventDefault={writeLetter} class="w-1/2 bg-white shadow-md rounded-lg p-8">
				<div class="mb-6 flex flex-col">
					<div class="w-1/3">
						<label for="letter-date" class="block text-gray-700 text-sm font-bold mb-2"
							>Letter Date</label
						>
						<input
							type="date"
							name="letter-date"
							placeholder="Enter letter date"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="w-2/3">
						<label for="content" class="block text-gray-700 text-sm font-bold mb-2"
							>Letter Content</label
						>
						<textarea
							name="content"
							placeholder="Enter letter content"
							class="block w-full rounded-md py-2 px-3 border border-gray-300 h-40 resize-none"
						/>
					</div>
				</div>
				<div class="flex justify-end">
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit"
					>
						Add Letter
					</button>
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						on:click={closeLetter}
					>
						Cancel
					</button>
				</div>
			</form>
		</div>
	{:else}
		<!-- MODAL 2 -->
		<div class=" w-screen flex-col filter-box2 bg-white">
			<button
				class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
				on:click={seeQueue}>See Queue</button
			>
			<div class="flex flex-row border-b-2">
				<button
					class="bg-green-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					on:click={startConsultation}>Call Patient In</button
				>
				<button
					class="bg-yellow-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					on:click={endConsultation}>End consultation</button
				>
				<button
					class="bg-orange-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					on:click={openMC}>Write MC</button
				>
				<button
					class="bg-purple-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					on:click={openLetter}>Write Referral Letter</button
				>
				<div class="addDocsForm">
					<form on:submit|preventDefault={addDocuments}>
						<label for="file-upload">Select a file:</label>
						<input type="file" id="file-upload" name="file-upload" accept="*" required />
						<input class="border rounded-sm" type="text" id="caption" name="caption" required />
						<button
							class="bg-green-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
							type="submit">Upload</button
						>
					</form>
				</div>
			</div>
			<div class="containers flex flex-row">
				<div class=" left-container flex flex-col">
					<div class="notepad">
						<form on:submit|preventDefault={addNotes} class=" bg-white shadow-md rounded-lg p-8">
							<div class="mb-6">
								<label for="notes" class="block text-gray-700 text-sm font-bold mb-2">
									Notes
								</label>
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
						<p>Treatment Plan</p>
						<form
							on:submit|preventDefault={addTreatmentPlan}
							class=" bg-white shadow-md rounded-lg p-8"
						>
							{#each $medicineData as { meds, quantity, notes }, index (index)}
								<div class="mb-6 flex justify-between">
									<div class="w-1/3">
										<label
											for={`meds${index + 1}`}
											class="block text-gray-700 text-sm font-bold mb-2">Medicine *</label
										>
										<input
											type="text"
											bind:value={meds}
											name={`meds${index + 1}`}
											placeholder="Enter medicine"
											class="block w-full rounded-md py-2 px-3 border border-gray-300"
											required
										/>
									</div>
									<div class="w-1/3">
										<label
											for={`quantity${index + 1}`}
											class="block text-gray-700 text-sm font-bold mb-2">Quantity *</label
										>
										<input
											type="number"
											bind:value={quantity}
											name={`quantity${index + 1}`}
											placeholder="Enter quantity"
											class="block w-full rounded-md py-2 px-3 border border-gray-300"
											required
										/>
									</div>
									<div class="w-1/3">
										<label
											for={`notes${index + 1}`}
											class="block text-gray-700 text-sm font-bold mb-2">Notes</label
										>
										<input
											type="text"
											bind:value={notes}
											name={`notes${index + 1}`}
											placeholder="Enter notes"
											class="block w-full rounded-md py-2 px-3 border border-gray-300"
										/>
									</div>
									{#if index === $medicineData.length - 1}
										<button
											type="button"
											class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md"
											on:click={deleteMedicineRow}
										>
											Delete Row
										</button>
									{/if}
								</div>
							{/each}
							{#if $medicineData.length < maxRows}
								<div class="flex justify-end">
									<button
										class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
										type="button"
										on:click={addMedicineRow}
									>
										Add More Meds
									</button>
								</div>
							{/if}
							<div class="flex justify-end">
								<button
									class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
									type="submit"
								>
									Add Treatment Plan
								</button>
							</div>
						</form>
					</div>
					<div class="follow-up">
						<p>Follow Up</p>
						<form on:submit|preventDefault={addFollowUp} class=" bg-white shadow-md rounded-lg p-8">
							<div class="mb-6 flex justify-between">
								<div class="w-1/3">
									<label for="follow-up-reason" class="block text-gray-700 text-sm font-bold mb-2"
										>Follow Up Reason *</label
									>
									<input
										type="text"
										name="follow-up-reason"
										placeholder="Enter reason"
										class="block w-full rounded-md py-2 px-3 border border-gray-300"
										required
									/>
								</div>
								<div class="w-1/3">
									<label for="date" class="block text-gray-700 text-sm font-bold mb-2">
										Follow Up Date and Time *
									</label>
									<input
										type="datetime-local"
										name="date"
										class="block w-full rounded-md py-2 px-3 border border-gray-300"
										required
									/>
								</div>
							</div>
							<div class="flex justify-end">
								<button
									class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
									type="submit"
								>
									Add Follow Up
								</button>
							</div>
						</form>
					</div>
				</div>
				<div class="right-container flex flex-col">
					<p class="font-semibold text-2xl text-center">Patient Details</p>
					<div class="patient-tabs flex flex-row justify-between">
						<button
							on:click={() => {
								seePastAppointments.set(false);
								seeDocuments.set(false);
								seePersonalInfo.set(true);
							}}
							class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
							>Personal Info</button
						>
						<button
							on:click={() => {
								seePersonalInfo.set(false);
								seeDocuments.set(false);
								seePastAppointments.set(true);
							}}
							class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
							>Past Appointments</button
						>
						<button
							on:click={() => {
								seePersonalInfo.set(false);
								seePastAppointments.set(false);
								seeDocuments.set(true);
							}}
							class="border-r-2 border-r-black border-b-2 border-b-white text-xl px-4 hover:border-b-2 hover:border-indigo-600"
							>Documents</button
						>
					</div>
					{#if $seePersonalInfo}
						<div class=" patient-personal-info border-2">
							<div class="flex flex-col">
								{#each partPatientInfo as personalInfo}
									<p>Name: {personalInfo.name}</p>
									<p>IC no: {personalInfo.IC}</p>
									<p>Gender: {personalInfo.gender}</p>
									<p>Age: {personalInfo.age}</p>
								{/each}
							</div>
						</div>
					{:else if $seePastAppointments}
						<div class="patient-past-appointments">
							<table>
								{#each patientHistory as history}
									<tr>
										<td>Date:</td>
										<td>{history.date}</td>
									</tr>
									<tr>
										<td>Reason:</td>
										<td>{history.reason}</td>
									</tr>
									<tr>
										<td>Notes:</td>
										<td>{history.notes}</td>
									</tr>
									<tr>
										<td>Amount:</td>
										<td>RM{history.amount}</td>
									</tr>

									{#each [1, 2, 3, 4, 5, 6, 7] as i}
										{#if history[`medName${i}`]}
											<tr>
												<td>Medicine:</td>
												<td>{history[`medName${i}`]}</td>
												<td class="ml-10">Quantity:</td>
												<td>{history[`quantity${i}`]}</td>
											</tr>
										{/if}
									{/each}
								{/each}
							</table>
						</div>
					{:else}
						{#each patientDocuments as docs}
							<div class="flex flex-row">
								<p>{docs.caption}</p>
								<p>{docs.dateAdded}</p>
								<a href={docs.imageURL} target="_blank" rel="document">View</a>
							</div>
						{/each}
					{/if}
				</div>
			</div>

			<!-- should be before this  -->
		</div>
	{/if}
</div>
