<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	// import { uploadImageFail, uploadImageSuc } from '../../utils/alert';
	import { writable } from 'svelte/store';

	// inventory
	// there is two main stores - show-all, add-new and low stock, edit, restock
	// by default, when come to medicine page, list of all meds is there w he details. do a get request in page.js, and show in page.svelte using table and can filter by amount and name. for each of them, have a edit and delete button.
	//if delete, it just gets removed.
	//if edit store is true, and modal pops up, w form prepopulated. can change amount here (not restock) have a close button and return to show-all.
	// at main page, have a button in top saying Add New. once clicked, a modal pops up w form and do endpoint. price is optional. have a close button and return to show-all
	// once low stock is clicked, show all meds w low stock. if forgot to restock, can click already restocked, and it will make restock  to be true and we do the same form like we did last time.

	export let data;

	const showAll = writable(true);
	const addNew = writable(false);
	const lowStock = writable(false);
	const edit = writable(false);
	const restock = writable(false);

	let tempMedToDel = {};

	export async function deleteMeds(id) {
		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/delete-medicine/${id}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (resp.status === 204) {
			console.log('success');
		} else {
			console.log('something went wrong there matey');
		}
	}

	export function openEdit(med) {
		tempMedToDel = med;
		showAll.set(false);
		edit.set(true);
	}

	export async function editMeds(evt) {
		let medicineID = tempMedToDel.id;

		let editMedsData = {
			medicine: evt.target['medicine'].value,
			quantity: parseInt(evt.target['quantity'].value),
			price: parseInt(evt.target['price'].value)
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + `/edit-medicine/${medicineID}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(editMedsData)
		});

		if (resp.status === 204) {
			console.log('success');
			edit.set(false);
			showAll.set(true);
		} else {
			console.log('something went wrong there matey');
		}
	}

	async function addNewMedicine(evt) {
		const medicineData = {
			name: evt.target['name'].value,
			quantity: parseInt(evt.target['quantity'].value),
			price: parseInt(evt.target['price'].value)
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/add-medicine', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(medicineData)
		});

		const res = await resp.json();
		console.log(res);

		if (resp.status == 200) {
			addNew.set(false);
			showAll.set(true);
		} else {
			console.log('oh noo');
		}
	}

	function clickRestocked(med) {
		tempMedToDel = med;
		lowStock.set(false);
		restock.set(true);
	}

	async function addExistingMedicine(evt) {
		const medicineData = {
			name: evt.target['name'].value,
			quantity: parseInt(evt.target['quantity'].value),
			price: parseInt(evt.target['price'].value)
		};

		const resp = await fetch(PUBLIC_BACKEND_BASE_URL + '/add-existing-medicine', {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json'
				// Authorization: getUserTokenFromLocalStorage()
			},
			body: JSON.stringify(medicineData)
		});

		const res = await resp.json();
		console.log(res);

		if (resp.status == 200) {
			restock.set(false);
			lowStock.set(true);
		} else {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			// uploadImageFail();
			if (res.error) {
				formErrors = res.error; // Update formErrors with validation errors
			}
		}
	}
</script>

{#if $showAll}
	<button
		on:click={() => {
			showAll.set(false);
			addNew.set(true);
		}}>Add New</button
	>
	<button
		on:click={() => {
			showAll.set(false);
			lowStock.set(true);
		}}>Low Stock</button
	>

	<div class="flex flex-col">
		{#each data.allMeds as all}
			<p>{all.medicine}</p>
			<p>{all.quantity}</p>
			<p>{all.price}</p>
			<button on:click={() => openEdit(all)}>Edit</button>
			<button on:click={() => deleteMeds(all.id)}>Delete</button>
		{/each}
	</div>
{:else if $edit}
	<div class="edit">
		<form on:submit|preventDefault={editMeds} class="w-1/2 bg-white shadow-md rounded-lg p-8">
			<div class="mb-6">
				<label for="medicine" class="block text-gray-700 text-sm font-bold mb-2"> Medicine </label>
				<input
					type="text"
					name="medicine"
					placeholder="Enter medicine"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={tempMedToDel.medicine}
					required
				/>

				<label for="quantity" class="block text-gray-700 text-sm font-bold mb-2"> Quantity </label>
				<input
					type="number"
					name="quantity"
					placeholder="Enter quantity"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={tempMedToDel.quantity}
					required
				/>
				<label for="price" class="block text-gray-700 text-sm font-bold mb-2"> Price </label>
				<input
					type="number"
					name="price"
					placeholder="Enter price per unit"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={tempMedToDel.price}
					required
				/>

				<div class="flex justify-end">
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						type="submit"
					>
						Edit Meds
					</button>
					<button
						class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
						on:click={() => {
							edit.set(false);
							showAll.set(true);
						}}
					>
						Cancel
					</button>
				</div>
			</div>
		</form>
	</div>
{:else if $addNew}
	<div class="flex justify-center items-center">
		<form on:submit|preventDefault={addNewMedicine} class="w-1/2 bg-white shadow-md rounded-lg p-8">
			<div class="mb-6">
				<label for="name" class="block text-gray-700 text-sm font-bold mb-2">
					New Medicine Name
				</label>
				<input
					type="text"
					name="name"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
				/>

				<div class="mb-6">
					<label for="quantity" class="block text-gray-700 text-sm font-bold mb-2">
						Quantity added
					</label>
					<input
						type="number"
						name="quantity"
						placeholder="Enter quantity added"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>

					<div class="mb-6">
						<label for="price" class="block text-gray-700 text-sm font-bold mb-2">
							Unit price
						</label>
						<input
							type="number"
							name="price"
							placeholder="Enter price per unit"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
						/>

						<div class="flex justify-end">
							<button
								class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
								type="submit"
							>
								Add New Medicine
							</button>
							<button
								class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
								on:click={() => {
									addNew.set(false);
									showAll.set(true);
								}}
							>
								Add New Medicine
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
{:else if $lowStock}
	<div class="flec flex-col">
		{#each data.restockMeds as low}
			<p>{low.medicine}</p>
			<p>{low.quantity}</p>
			<p>{low.price}</p>
			<button on:click={() => clickRestocked(low)}>Already Restocked?</button>
		{/each}
	</div>
{:else}
	<div class="flex justify-center items-center">
		<form
			on:submit|preventDefault={addExistingMedicine}
			class="w-1/2 bg-white shadow-md rounded-lg p-8"
		>
			<div class="mb-6">
				<label for="name" class="block text-gray-700 text-sm font-bold mb-2"> Medicine Name </label>
				<input
					type="text"
					name="name"
					placeholder="Enter medicine name"
					class="block w-full rounded-md py-2 px-3 border border-gray-300"
					bind:value={tempMedToDel.medicine}
				/>

				<div class="mb-6">
					<label for="quantity" class="block text-gray-700 text-sm font-bold mb-2">
						Quantity added
					</label>
					<input
						type="number"
						name="quantity"
						placeholder="Enter quantity added"
						class="block w-full rounded-md py-2 px-3 border border-gray-300"
					/>

					<div class="mb-6">
						<label for="price" class="block text-gray-700 text-sm font-bold mb-2">
							Unit price
						</label>
						<input
							type="number"
							name="price"
							placeholder="Enter price per unit"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
							required
						/>

						<div class="flex justify-end">
							<button
								class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
								type="submit"
							>
								Add Medicine
							</button>
							<button
								class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
								on:click={() => {
									restock.set(false);
									lowStock.set(true);
								}}
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</div>
		</form>
	</div>
{/if}
