<script>
	import { goto } from '$app/navigation';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { writable } from 'svelte/store';
	import { formatDateTime } from '../../utils/date.js';

	let seeAllModal = writable(true);
	let seeMoreModal = writable(false);
	let editApptModal = writable(false);

	export let data;
	let seeMore;
	let apptToEdit;
	let seeMoreDocuments = [];
	let editDocuments = [];

	// filtering name and IC for table
	let nameFilter = '';
	let icFilter = '';

	$: filteredAppointments = data.completedAppointments.filter(
		(appointment) =>
			appointment.patientDetails.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
			appointment.patientIC.toLowerCase().includes(icFilter.toLowerCase())
	);

	export async function openSeeMore(appointment) {
		seeMore = appointment;

		let patientIC = seeMore.patientDetails.IC;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-documents/${patientIC}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			seeMoreDocuments = res.patientDocuments;
			// Set loading back to false after fetching completes
			// loading = false;
		} else {
			seeMoreDocuments = [];
			// Set loading back to false after fetching completes
			// loading = false;
		}

		console.log(seeMore);
		seeAllModal.set(false);
		seeMoreModal.set(true);
	}

	export function closeSeeMore() {
		seeMore;
		seeMoreModal.set(false);
		seeAllModal.set(true);
	}

	export async function openEditAppt(appointment) {
		apptToEdit = appointment;

		let patientIC = apptToEdit.patientDetails.IC;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/get-documents/${patientIC}`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const res = await resp.json();
		if (resp.status == 200) {
			editDocuments = res.patientDocuments;
			// Set loading back to false after fetching completes
			// loading = false;
		} else {
			editDocuments = [];
			// Set loading back to false after fetching completes
			// loading = false;
		}
		console.log(appointment);
		seeAllModal.set(false);
		seeMoreModal.set(false);
		editApptModal.set(true);
	}

	export function closeEditAppt() {
		apptToEdit;
		editApptModal.set(false);
		seeMoreModal.set(false);
		seeAllModal.set(true);
	}

	export async function editCompletedAppointment(evt, appointment) {
		const fileInput = document.getElementById('file-upload');
		const file = fileInput.files[0];
		const caption = evt.target['caption'].value;
		// Construct FormData object
		const formData = new FormData();

		console.log(parseInt(evt.target['amount'].value));
		console.log(typeof parseInt(evt.target['amount'].value));

		apptToEdit = appointment;
		const ID = apptToEdit.id;
		formData.append('file-upload', file);
		formData.append('caption', caption);
		formData.append('reason', evt.target['reason'].value); // Append the file
		formData.append('notes', evt.target['notes'].value); // Append the caption
		formData.append('amount', parseInt(evt.target['amount'].value)); // Append the file
		formData.append('medName1', evt.target['med-name1'].value); // Append the caption
		formData.append('quantity1', parseInt(evt.target['quantity1'].value)); // Append the file
		formData.append('notes1', evt.target['notes1'].value); // Append the caption
		formData.append('medName2', evt.target['med-name2'].value); // Append the caption
		formData.append('quantity2', parseInt(evt.target['quantity2'].value)); // Append the file
		formData.append('notes2', evt.target['notes2'].value); // Append the caption
		formData.append('medName3', evt.target['med-name3'].value); // Append the caption
		formData.append('quantity3', parseInt(evt.target['quantity3'].value)); // Append the file
		formData.append('notes3', evt.target['notes3'].value); // Append the caption
		formData.append('medName4', evt.target['med-name4'].value); // Append the caption
		formData.append('quantity4', parseInt(evt.target['quantity4'].value)); // Append the file
		formData.append('notes4', evt.target['notes4'].value); // Append the caption
		formData.append('medName5', evt.target['med-name5'].value); // Append the caption
		formData.append('quantity5', parseInt(evt.target['quantity5'].value)); // Append the file
		formData.append('notes5', evt.target['notes5'].value); // Append the caption
		formData.append('medName6', evt.target['med-name6'].value); // Append the caption
		formData.append('quantity6', parseInt(evt.target['quantity6'].value)); // Append the file
		formData.append('notes6', evt.target['notes6'].value); // Append the caption
		formData.append('medName7', evt.target['med-name7'].value); // Append the caption
		formData.append('quantity7', parseInt(evt.target['quantity7'].value)); // Append the file
		formData.append('notes7', evt.target['notes7'].value); // Append the caption
		formData.append('IC', apptToEdit.patientDetails.IC);

		console.log(formData);
		// reason, doctor, notes, documents, medName1, medName2, quantity1, quantity2, notes1, notes2, amount
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/edit-completed-appointment/${ID}`, {
			method: 'PATCH',
			mode: 'cors',
			body: formData
		});

		const res = await resp.json();
		if (resp.status == 200) {
			apptToEdit;
			editApptModal.set(false);
			seeMoreModal.set(false);
			seeAllModal.set(true);
		} else {
			apptToEdit;
			console.log('hello2');
		}
	}

	export async function deleteDocs(document) {
		let documentID = document[0].id;
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/delete-documents/${documentID}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status === 204) {
			console.log('deleted');
		} else {
			console.log('did not delete');
		}
	}
</script>

{#if $seeAllModal}
	<div class="see-all">
		<h3 class="font-bold text-3xl text-pink-700 border-b-2  bg-white p-5">Completed Appointments</h3>
		<div>
			{#if data.completedAppointments.length > 0}
				<div>
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
								<th>Name</th>
								<th>Age</th>
								<th>Gender</th>
								<th>IC</th>
								<th>Date</th>
								<th>Consult Start Time</th>
								<th>Reason</th>
								<th>Doctor</th>
								<th>Notes</th>
								<th>Documents</th>
								<th>MedName1</th>
								<th>Quantity1</th>
								<th>Notes1</th>
								<th>MedName2</th>
								<th>Quantity2</th>
								<th>Notes2</th>
								<th>Amount</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{#each filteredAppointments as completed}
								<tr class="hover:bg-gray-200 hover:text-black hover:cursor-auto">
									<td class="border border-gray-400 px-4 py-2 capitalize">{completed.patientDetails.name}</td>
									<td class="border border-gray-400 px-4 py-2">{completed.patientDetails.age}</td>
									<td class="border border-gray-400 px-4 py-2 capitalize">{completed.patientDetails.gender}</td>
									<td class="border border-gray-400 px-4 py-2">{completed.patientIC}</td>
									<td class="border border-gray-400 px-4 py-2">{formatDateTime(completed.date)}</td>
									<td class="border border-gray-400 px-4 py-2">{formatDateTime(completed.consultStartTime)}</td>
									<td class="border border-gray-400 px-4 py-2 capitalize">{completed.reason}</td>
									<td class="border border-gray-400 px-4 py-2 capitalize">{completed.doctor}</td>
									<td class="border border-gray-400 px-4 py-2 capitalize">{completed.notes}</td>
									<td class="border border-gray-400 px-4 py-2">{completed.documents}</td>
									<td class="border border-gray-400 px-4 py-2 ">{completed.medName1}</td>
									<td class="border border-gray-400 px-4 py-2 ">{completed.quantity1}</td>
									<td class="border border-gray-400 px-4 py-2 ">{completed.notes1}</td>
									<td class="border border-gray-400 px-4 py-2 capitalize">{completed.medName2}</td>
									<td class="border border-gray-400 px-4 py-2 ">{completed.quantity2}</td>
									<td class="border border-gray-400 px-4 py-2 ">{completed.notes2}</td>
									<td class="border border-gray-400 px-4 py-2 ">{completed.amount}</td>
									<td class="border border-gray-400 px-2 py-2">
										<button class="bg-indigo-600 hover:bg-indigo-900 text-white text-xs font-medium rounded-md px-2 py-1" on:click={() => openSeeMore(completed)}>See More</button>
										<button class="bg-indigo-600 hover:bg-indigo-900 text-white text-xs font-medium rounded-md px-2 py-1 w-full mt-2" on:click={() => openEditAppt(completed)}>Edit</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p>No completed appointments!</p>
			{/if}
		</div>
	</div>
{:else if $seeMoreModal}
	<!-- See More Modal -->
	<div class="see-more flex flex-col items-center justify-center h-screen">
		{#if seeMore}
		<div class="w-1/2 bg-white h-[70%] rounded-xl overflow-y-auto custom-scrollbar p-5 ">
			<div class="flex items-center justify-end gap-4">
				<button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md" on:click={closeSeeMore}>Close</button>
				<button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md" on:click={() => openEditAppt(seeMore)}>Edit</button>
			</div>
			<div>
				<h2 class="text-pink-700 text-2xl font-medium my-5 capitalize">{seeMore.patientDetails.name}'s Details</h2>
				<div class="flex flex-col gap-2">
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Age:</h1>
						<p class="text-gray-500 font-medium">{seeMore.patientDetails.age}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Gender:</h1>
						<p class="text-gray-500 font-medium">{seeMore.patientDetails.gender}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">IC:</h1>
						<p class="text-gray-500 font-medium">{seeMore.patientDetails.patientIC}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Date:</h1>
						<p class="text-gray-500 font-medium">{seeMore.patientDetails.date}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Consult Start Time:</h1>
						<p class="text-gray-500 font-medium">{seeMore.consultStartTime}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Reason:</h1>
						<p class="text-gray-500 font-medium">{seeMore.reason}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes}</p>
					</div>
					{#if seeMoreDocuments.length > 0}
						{#each seeMoreDocuments as SD}
							<div class="flex items-center gap-3">
								<h1 class="text-black font-medium">Documents:</h1>
								<a class="text-gray-500 font-medium" href={SD.imageURL} target="_blank" rel="document">View</a>
							</div>
					{/each}
					{:else}
						<div class="flex items-center gap-3">
							<h1 class="text-black font-medium">Documents:</h1>
							<p class="text-gray-500 font-medium">No Documents</p>
						</div>
					{/if}
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 1:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName1}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 2:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity1}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 1:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes1}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 1:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName1}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 2:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName2}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 2:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity2}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 2:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes2}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 3:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName3}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 3:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity3}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 3:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes3}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 4:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName4}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 4:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity4}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 4:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes4}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 5:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName5}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 5:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity5}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 5:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes5}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 6:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName6}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 6:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity6}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 6:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes6}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Med name 7:</h1>
						<p class="text-gray-500 font-medium">{seeMore.medName7}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Quantity 7:</h1>
						<p class="text-gray-500 font-medium">{seeMore.quantity7}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Notes 7:</h1>
						<p class="text-gray-500 font-medium">{seeMore.notes7}</p>
					</div>
					<div class="flex items-center gap-3">
						<h1 class="text-black font-medium">Amount:</h1>
						<p class="text-gray-500 font-medium">{seeMore.amount}</p>
					</div>
				</div>
			</div>
		</div>
		{:else}
			<p>Nothing to show</p>
		{/if}
	</div>
{:else}
	<!-- Edit Appt Modal -->
	<div class="flex flex-col justify-center h-screen items-center edit-appt">
		<p class="text-white text-xl font-medium">Edit Appointment</p>
		<form
			enctype="multipart/form-data"
			on:submit|preventDefault={(evt) => editCompletedAppointment(evt, apptToEdit)}
			class="w-1/2 h-[70%] overflow-y-auto bg-white shadow-md rounded-lg p-5 mt-5 custom-scrollbar"
		>
			<div class="mb-6">
				<label for="reason" class="block text-gray-700 text-sm font-bold mb-2"> Reason </label>
				<input
					type="text"
					name="reason"
					placeholder="Enter reason"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.reason}
					required
				/>
				<!-- {#if 'reason' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.reason}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes" class="block text-gray-700 text-sm font-bold mb-2"> Notes </label>
				<input
					type="text"
					name="notes"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes}
					required
				/>
				<!-- {#if 'notes' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="amount" class="block text-gray-700 text-sm font-bold mb-2">Amount</label>
				<input
					type="number"
					name="amount"
					placeholder="Enter amount"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.amount}
				/>
				<!-- {#if 'amount' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.amount}</p>
			{/if} -->
			</div>
			{#if editDocuments.length > 0}
				<p>Documents:</p>
				{#each editDocuments as ED}
					<a href={ED.imageURL} target="_blank" rel="document">View</a>
					<button on:click={() => deleteDocs(editDocuments)} class="bg-blue-400">DELETE</button>
				{/each}
			{:else}
				<h1 class="text-gray-700 text-sm font-bold mb-2">Documents</h1>
				<input 
					type="text" 
					name="documents" 
					readonly
					value="No Documents"
					class="block mb-6 w-full rounded-md py-2 px-3 border border-gray-300 text-white"
				/>
			{/if}

			<div class="mb-6">
				<label for="file-upload" class="text-gray-700 text-sm font-bold "> Upload Document </label>
				<input 
					id="file-upload" 
					type="file"
					name="file-upload"
					accept="*"
					required
					class="my-2 block w-full py-2 px-3 text-sm text-gray-900 rounded-lg cursor-pointer bg-black dark:text-gray-400 focus:outline-none dark:bg-black dark:border-gray-600 dark:placeholder-gray-400" 
				/>
				<input
					type="text"
					id="caption"
					name="caption"
					placeholder="Enter caption"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
				/>
				<!-- {#if 'documents' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.documents}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name1" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name1"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName1}
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity1" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity1"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity1}
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes1" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes1"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>
			<div class="mb-6">
				<label for="med-name2" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name2"
					placeholder="Enter med name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName2}
				/>
				<!-- {#if 'med-name2' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity2" class="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
				<input
					type="number"
					name="quantity2"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity2}
				/>
				<!-- {#if 'quantity2' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes2" class="block text-gray-700 text-sm font-bold mb-2">Med Notes</label>
				<input
					type="text"
					name="notes2"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes2}
				/>
				<!-- {#if 'notes2' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name3" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name3"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName1}
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity3" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity3"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity1}
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes3" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes3"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name4" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name4"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName1}
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity4" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity4"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity1}
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes4" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes4"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name5" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name5"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName1}
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity5" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity5"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity1}
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes5" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes5"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name6" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name6"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName1}
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity6" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity6"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity1}
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes6" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes6"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="med-name7" class="block text-gray-700 text-sm font-bold mb-2">
					Medicine Name
				</label>
				<input
					type="text"
					name="med-name7"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.medName1}
				/>
				<!-- {#if 'med-name1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.med-name1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="quantity7" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity7"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.quantity1}
				/>
				<!-- {#if 'quantity1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.quantity1}</p>
			{/if} -->
			</div>

			<div class="mb-6">
				<label for="notes7" class="block text-gray-700 text-sm font-bold mb-2"> Med notes </label>
				<input
					type="text"
					name="notes7"
					placeholder="Enter notes"
					class="block w-full rounded-md py-2 px-3 border border-gray-300 text-white"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="flex justify-end gap-5">
				<button
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					type="submit"
				>
					Edit Completed Appointment
				</button>
				<button
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
					on:click={closeEditAppt}
				>
					Cancel
				</button>
			</div>
		</form>
	</div>
{/if}
