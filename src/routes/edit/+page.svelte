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
		<span class="font-bold text-3xl text-pink-700">Completed Appointments</span>
		<div>
			{#if data.completedAppointments.length > 0}
				<div>
					<input type="text" bind:value={nameFilter} placeholder="Filter by Name" />
					<input type="text" bind:value={icFilter} placeholder="Filter by IC" />

					<table>
						<thead>
							<tr>
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
								<tr>
									<td>{completed.patientDetails.name}</td>
									<td>{completed.patientDetails.age}</td>
									<td>{completed.patientDetails.gender}</td>
									<td>{completed.patientIC}</td>
									<td>{formatDateTime(completed.date)}</td>
									<td>{formatDateTime(completed.consultStartTime)}</td>
									<td>{completed.reason}</td>
									<td>{completed.doctor}</td>
									<td>{completed.notes}</td>
									<td>{completed.documents}</td>
									<td>{completed.medName1}</td>
									<td>{completed.quantity1}</td>
									<td>{completed.notes1}</td>
									<td>{completed.medName2}</td>
									<td>{completed.quantity2}</td>
									<td>{completed.notes2}</td>
									<td>{completed.amount}</td>
									<td>
										<button on:click={() => openSeeMore(completed)}>See More</button>
										<button on:click={() => openEditAppt(completed)}>Edit</button>
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
	<div class="see-more flex flex-col">
		{#if seeMore}
			<button on:click={closeSeeMore}>Close</button>
			<button on:click={() => openEditAppt(seeMore)}>Edit</button>
			<div>
				<h2>{seeMore.patientDetails.name}'s Details</h2>
				<p>Age: {seeMore.patientDetails.age}</p>
				<p>Gender: {seeMore.patientDetails.gender}</p>
				<p>IC: {seeMore.patientIC}</p>
				<p>Date: {formatDateTime(seeMore.date)}</p>
				<p>Consult Start Time: {formatDateTime(seeMore.consultStartTime)}</p>
				<p>Reason: {seeMore.reason}</p>
				<p>Notes: {seeMore.notes}</p>
				{#if seeMoreDocuments.length > 0}
					{#each seeMoreDocuments as SD}
						<p>Documents:</p>
						<a href={SD.imageURL} target="_blank" rel="document">View</a>
					{/each}
				{:else}
					<p>Documents: No Documents</p>
				{/if}
				<p>MedName1: {seeMore.medName1}</p>
				<p>Quantity1: {seeMore.quantity1}</p>
				<p>Notes1: {seeMore.notes1}</p>
				<p>MedName2: {seeMore.medName2}</p>
				<p>Quantity2: {seeMore.quantity2}</p>
				<p>Notes2: {seeMore.notes2}</p>
				<p>MedName3: {seeMore.medName3}</p>
				<p>Quantity3: {seeMore.quantity3}</p>
				<p>Notes3: {seeMore.notes3}</p>
				<p>MedName4: {seeMore.medName4}</p>
				<p>Quantity4: {seeMore.quantity4}</p>
				<p>Notes4: {seeMore.notes4}</p>
				<p>MedName5: {seeMore.medName5}</p>
				<p>Quantity5: {seeMore.quantity5}</p>
				<p>Notes5: {seeMore.notes5}</p>
				<p>MedName6: {seeMore.medName6}</p>
				<p>Quantity6: {seeMore.quantity6}</p>
				<p>Notes6: {seeMore.notes6}</p>
				<p>MedName7: {seeMore.medName7}</p>
				<p>Quantity7: {seeMore.quantity7}</p>
				<p>Notes7: {seeMore.notes7}</p>
				<p>Amount: {seeMore.amount}</p>
			</div>
		{:else}
			<p>Nothing to show</p>
		{/if}
	</div>
{:else}
	<!-- Edit Appt Modal -->
	<div class="flex justify-center items-center edit-appt">
		<p>Edit Appointment</p>
		<form
			enctype="multipart/form-data"
			on:submit|preventDefault={(evt) => editCompletedAppointment(evt, apptToEdit)}
			class="w-1/2 bg-white shadow-md rounded-lg p-8"
		>
			<div class="mb-6">
				<label for="reason" class="block text-gray-700 text-sm font-bold mb-2"> Reason </label>
				<input
					type="text"
					name="reason"
					placeholder="Enter reason"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
				<p>Documents: No Documents</p>
			{/if}

			<div class="mb-6">
				<label for="file-upload"> Upload Document </label>
				<input type="file" id="file-upload" name="file-upload" accept="*" />
				<input
					type="text"
					id="caption"
					name="caption"
					placeholder="Enter caption"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
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
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={apptToEdit.notes1}
				/>
				<!-- {#if 'notes1' in formErrors}
				<p class="text-red-500 text-xs mt-1">{formErrors.notes2}</p>
			{/if} -->
			</div>

			<div class="flex justify-end">
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
