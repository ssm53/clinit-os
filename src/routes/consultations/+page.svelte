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
	import {
		seeDocuments,
		seePastAppointments,
		seePersonalInfo,
		appointmentsWaiting
	} from '../../stores/store';

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

	// $: filteredAppointments = data.waitingAppointments.filter(
	// 	(appointment) =>
	// 		appointment.patientDetails.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
	// 		appointment.patientIC.toLowerCase().includes(icFilter.toLowerCase())
	// );

	appointmentsWaiting.set(data.waitingAppointments);

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

<div class="h-screen flex flex-col ">
	{#if $queue}
		<!-- <div class="border-b-2  bg-white p-5">
			<span class="font-bold text-3xl text-pink-700">Queue</span>
		</div> -->
		<!-- MODAL 1 -->
		<div class="w-screen filter-box">

			<div class="flex items-center gap-5 pl-1 py-3 bg-gray-500">
				<div class="px-4 py-2 w-[20%]">
					<input 
						type="text" 
						bind:value={nameFilter} 
						placeholder="Filter by Name"
						class="block w-full rounded-md py-2 px-3 bg-white text-black outline-gray-400"
					/>
				</div>
				<div class="px-4 py-2 w-[20%]">
					<input 
						type="text" 
						bind:value={icFilter} 
						placeholder="Filter by IC"
						class="block w-full rounded-md py-2 px-3 bg-white text-black outline-gray-400"
					 />
				</div>
			</div>

			<table class="border-collapse w-full">
				<thead>
					<tr class="bg-gray-500 text-white">
						<th class="border border-gray-400 px-4 py-2">Age</th>
						<th class="border border-gray-400 px-4 py-2">Name</th>
						<th class="border border-gray-400 px-4 py-2">Gender</th>
						<th class="border border-gray-400 px-4 py-2">IC</th>
						<th class="border border-gray-400 px-4 py-2">Reason</th>
						<th class="border border-gray-400 px-4 py-2">Arrival Time</th>
						<th class="border border-gray-400 px-4 py-2">Waiting Time</th>
						<th class="border border-gray-400 px-4 py-2">Status</th>
						<th class="border border-gray-400 px-4 py-2">Action</th>
					</tr>
				</thead>
				<tbody>
					{#each $appointmentsWaiting as appointment}
						<tr class="hover:bg-gray-200 hover:text-black hover:cursor-auto">
							<td class="border border-gray-400 px-4 py-2 capitalize">{appointment.patientDetails.name}</td>
							<td class="border border-gray-400 px-4 py-2">{appointment.patientDetails.age}</td>
							<td class="border border-gray-400 px-4 py-2 capitalize">{appointment.patientDetails.gender}</td>
							<td class="border border-gray-400 px-4 py-2">{appointment.patientIC}</td>
							<td class="border border-gray-400 px-4 py-2 capitalize">{appointment.reason}</td>
							<td class="border border-gray-400 px-4 py-2">{formatDateTime(appointment.arrivalTime)}</td>
							<td class="border border-gray-400 px-4 py-2">{calculateWaitingTime(appointment.arrivalTime)}</td>
							<td class="border border-gray-400 px-4 py-2">{appointment.status}</td>
							<td class="border border-gray-400 px-4 py-2">
								<button class="bg-blue-500 hover:bg-blue-900 w-full text-white text-xs font-medium rounded-md py-2" on:click={() => viewAppointment(appointment.patientIC, appointment.id)}>
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
		<div class="write-MC flex flex-col flex-grow items-center justify-center">
			<p class="text-xl font-medium text-white uppercase mb-5">Write MC</p>
			<form on:submit|preventDefault={writeMC} class="w-1/2 bg-white shadow-md rounded-lg p-8">
				<div class="mb-6 flex flex-col gap-5">
					<div class="">
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2">Name</label>
						<input
							type="text"
							name="name"
							placeholder="Enter name"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="">
						<label for="reason" class="block text-gray-700 text-sm font-bold mb-2">Reason</label>
						<input
							type="text"
							name="reason"
							placeholder="Enter reason"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="">
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
				<div class="mb-6 flex flex-col gap-5">
					<div class="">
						<label for="mcEnd" class="block text-gray-700 text-sm font-bold mb-2">End Date</label>
						<input
							type="date"
							name="mcEnd"
							placeholder="Enter end date of MC"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
					</div>
					<div class="">
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
				<div class="flex justify-end gap-5">
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
			class="write-letter flex flex-grow items-center justify-center"
		>
			<form on:submit|preventDefault={writeLetter} class="w-1/2 bg-white shadow-md rounded-lg p-8">
				<div class="mb-6 flex flex-col">
					<div class="">
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
					<div class="mt-6">
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
				<div class="flex justify-end gap-5">
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
		<div class=" w-screen filter-box2 bg-white">
			<div class="flex items-center justify-between py-4 px-5 ">
				<button
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					on:click={seeQueue}>{"<"}</button
				>
				<div class="flex gap-2">
					<button
						class="border-2 border-indigo-600 hover:bg-gray-300 text-black font-bold py-1 px-4 rounded-md"
						on:click={openMC}>Write MC</button
					>
					<button
						class="border-2 border-indigo-600 hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-md"
						on:click={openLetter}>Write Referral Letter</button
					>
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						on:click={startConsultation}>Call Patient In</button
					>
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						on:click={endConsultation}>End consultation</button
					>
				</div>
			</div>
			<div class="w-full flex items-center justify-end pr-5">
				<form class="flex items-center gap-2" on:submit|preventDefault={addDocuments}>
					<div>
						<!-- <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file-upload">Upload file</label> -->
						<input 
							id="file-upload" 
							type="file"
							name="file-upload"
							accept="*"
							required
							class="block w-full py-2 px-3 text-sm text-gray-900 rounded-lg cursor-pointer bg-black dark:text-gray-400 focus:outline-none dark:bg-black dark:border-gray-600 dark:placeholder-gray-400" 
						/>
						<!-- <label for="file-upload">Select a file:</label>
						<input type="file" id="file-upload" name="file-upload" accept="*" required /> -->
					</div>
					<div>
						<input class="border rounded-md py-2 px-2" placeholder="Caption" type="text" id="caption" name="caption" required />
					</div>			
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit">Upload</button
					>
				</form>
			</div>
			<div class="flex justify-around mt-6 pb-10 ">
				<div class="flex flex-col w-[55%]">
					<div class="notepad border-2 shadow-lg border-dashed rounded-lg">
						<form on:submit|preventDefault={addNotes} class=" bg-white px-5 py-3">
							<div class="mb-6">
								<label for="notes" class="block text-pink-700 text-md font-bold mb-2">
									Notes
								</label>
								<textarea 
									name="notes" 
									placeholder="Enter something"
									class="block w-full rounded-md py-2 px-3 h-20 border border-gray-300"
								></textarea>
								<!-- <input
									type="text"
									name="notes"
									placeholder="Enter something"
									class="block w-full rounded-md py-2 px-3 h-20 border border-gray-300"
								/> -->
								<div class="flex justify-end mt-2">
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
					<div class="treatment-plan mt-6 border-2 shadow-lg border-dashed rounded-lg">
						<form
							on:submit|preventDefault={addTreatmentPlan}
							class=" bg-white p-8"
						>
						<p class="block text-pink-700 text-md font-bold mb-5">Treatment Plan</p>

							{#each $medicineData as { meds, quantity, notes }, index (index)}
								<div class="mb-6 flex  items-end gsp-2">
									<div class="w-1/4">
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
									<div class="w-1/4">
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
									<div class="w-1/4">
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
											class="w-1/4 bg-red-600 h-10 it hover:bg-red-700 text-white text-sm font-bold rounded-md"
											on:click={deleteMedicineRow}
										>
											Delete Row
										</button>
									{/if}
								</div>
							{/each}
							<div class="flex items-end gap-1 justify-end">
								{#if $medicineData.length < maxRows}
									<div class="flex justify-end">
										<button
											class=" bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-9 rounded-md"
											type="button"
											on:click={addMedicineRow}
										>
											Add More Meds
										</button>
									</div>
								{/if}
								<div class="flex justify-end">
									<button
										class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-md"
										type="submit"
									>
										Add Treatment Plan
									</button>
								</div>
							</div>
						</form>
					</div>
					<div class="follow-up mt-6 border-2 shadow-lg border-dashed rounded-lg">
						<form on:submit|preventDefault={addFollowUp} class=" bg-white shadow-md rounded-lg p-8">
							<p class="text-pink-700 text-md font-bold mb-5">Follow Up</p>
							<div class="mb-6 flex justify-between">
								<div class="w-1/2">
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
								<div class="w-1/2">
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
				<div class="flex flex-col w-[35%] mt-5">
					<p class="font-semibold text-2xl text-center text-pink-700 mb-3">Patient Details</p>
					<div class="patient-tabs flex items-center justify-center">
						<button
							on:click={() => {
								seePastAppointments.set(false);
								seeDocuments.set(false);
								seePersonalInfo.set(true);
							}}
							class="border-b-2 border-transparent leading-tight uppercase text-[0.9rem] font-medium py-2 px-4 hover:bg-gray-100"
							>Personal Info</button
						>
						<button
							on:click={() => {
								seePersonalInfo.set(false);
								seeDocuments.set(false);
								seePastAppointments.set(true);
							}}
							class="border-b-2 border-transparent leading-tight uppercase text-[0.9rem] font-medium py-2 px-4 hover:bg-gray-100"							
							>Past Appointments</button
						>
						<button
							on:click={() => {
								seePersonalInfo.set(false);
								seePastAppointments.set(false);
								seeDocuments.set(true);
							}}
							class="border-b-2 border-transparent leading-tight uppercase text-[0.9rem] font-medium py-2 px-4 hover:bg-gray-100"							
							>Documents</button
						>
					</div>
					{#if $seePersonalInfo}
						<div class=" patient-personal-info mt-3 rounded-lg shadow-lg p-3">
							<div class="flex flex-col gap-3">
								{#each partPatientInfo as personalInfo}
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Name:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{personalInfo.name}</p>
									</div>
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">IC number:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{personalInfo.IC}</p>
									</div>
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Gender:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{personalInfo.gender}</p>
									</div>
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Age:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{personalInfo.age}</p>
									</div>
								{/each}
							</div>
						</div>
					{:else if $seePastAppointments}
						<div class="patient-past-appointments mt-3 rounded-lg shadow-lg p-5">
							<div class="flex flex-col gap-3">
								{#each patientHistory as history}
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Date:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{history.date}</p>
									</div>
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Reason:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{history.reason}</p>
									</div>
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Notes:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{history.notes}</p>
									</div>
									<div class="flex gap-2 items-center">
										<h3 class="font-bold text-sm text-pink-700">Amount:</h3>
										<p class="text-sm font-medium text-gray-500 capitalize">{history.amount}</p>
									</div>
									{#each [1, 2, 3, 4, 5, 6, 7] as i}
										{#if history[`medName${i}`]}
											<div class="flex gap-2 items-center">
												<h3 class="font-bold text-sm text-pink-700">Medicine:</h3>
												<p class="text-sm font-medium text-gray-500 capitalize">{history[`medName${i}`]}</p>,
												<h3 class="font-bold text-sm text-pink-700">Quantity:</h3>
												<p class="text-sm font-medium text-gray-500 capitalize">{history[`quantity${i}`]}</p>
											</div>
										{/if}
									{/each}
								{/each}
							</div>
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
