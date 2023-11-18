<script>
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	import { goto } from '$app/navigation';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { getUserTokenFromLocalStorage } from '../../utils/auth';
	// import { uploadImageFail, uploadImageSuc } from '../../utils/alert';
	import { writable } from 'svelte/store';

	let formErrors = {};
	export const newMedicine = writable(false);
	export const existingMedicine = writable(false);

	export function postAddMedicine() {
		// uploadImageSuc();
		goto('/medicine');
	}

	async function addNewMedicine(evt) {
		// // spinner shits
		// loading.update((value) => {
		// 	return true;
		// });
		// name, IC, age, sex, email, contact nummber, age, race
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
				// Authorization: getUserTokenFromLocalStorage()
			},
			body: JSON.stringify(medicineData)
		});

		const res = await resp.json();
		console.log(res);

		if (resp.status == 200) {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			postAddMedicine();
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

	async function addExistingMedicine(evt) {
		// // spinner shits
		// loading.update((value) => {
		// 	return true;
		// });
		// name, IC, age, sex, email, contact nummber, age, race
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
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			postAddMedicine();
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

	export async function clickNewMedicine() {
		existingMedicine.set(false);
		newMedicine.set(true);
	}

	export async function clickExistingMedicine() {
		newMedicine.set(false);
		existingMedicine.set(true);
	}
</script>

<div class="bg-white min-h-screen">
	<header class="bg-gray-100 shadow">
		<div class="container mx-auto py-4">
			<h1 class="text-2xl font-semibold text-gray-900">Add Medicine</h1>
		</div>
	</header>

	<main class="container mx-auto py-8">
		<!-- <Spinner /> -->
		<button on:click={() => clickNewMedicine()}>Add new medicine</button>
		<button on:click={() => clickExistingMedicine()}>Add stock to existing medicine</button>
		{#if $newMedicine}
			<div class="flex justify-center items-center">
				<form
					on:submit|preventDefault={addNewMedicine}
					class="w-1/2 bg-white shadow-md rounded-lg p-8"
				>
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
						<!-- {#if 'name' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['name']}</p>
					{/if}
				</div> -->

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
							<!-- {#if 'IC' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['IC']}</p>
					{/if}
				</div> -->

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
								<!-- {#if 'age' in formErrors}
								<p class="text-red-500 text-xs mt-1">{formErrors['age']}</p>
							{/if}
						</div> -->

								<div class="flex justify-end">
									<button
										class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
										type="submit"
									>
										Add New Medicine
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		{:else}
			<div class="flex justify-center items-center">
				<form
					on:submit|preventDefault={addExistingMedicine}
					class="w-1/2 bg-white shadow-md rounded-lg p-8"
				>
					<div class="mb-6">
						<label for="name" class="block text-gray-700 text-sm font-bold mb-2">
							Medicine Name
						</label>
						<input
							type="text"
							name="name"
							placeholder="Enter medicine name"
							class="block w-full rounded-md py-2 px-3 border border-gray-300"
						/>
						<!-- {#if 'name' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['name']}</p>
					{/if}
				</div> -->

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
							<!-- {#if 'IC' in formErrors}
						<p class="text-red-500 text-xs mt-1">{formErrors['IC']}</p>
					{/if}
				</div> -->

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
								<!-- {#if 'age' in formErrors}
								<p class="text-red-500 text-xs mt-1">{formErrors['age']}</p>
							{/if}
						</div> -->

								<div class="flex justify-end">
									<button
										class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md"
										type="submit"
									>
										Add Medicine
									</button>
								</div>
							</div>
						</div>
					</div>
				</form>
			</div>
		{/if}
	</main>
</div>
