<script>
	import { authenticateUser } from '../../utils/auth';
	import { goto } from '$app/navigation';
	// import { showLoginAlert, loginSucAlert } from '../../utils/alert';
	// import Spinner from '../../spinner/spinner.svelte';
	// import { loading } from '../../stores/store';
	import { PUBLIC_BACKEND_BASE_URL } from '$env/static/public';
	// import Header from '../../../utils/Header.svelte';

	let formErrors = {};

	let email = '';
	let password = '';

	async function handleUserSubmit(event) {
		event.preventDefault();
		// // spinner shit
		// loading.update((value) => {
		// 	return true;
		// });

		email = event.target.email.value;
		password = event.target.password.value;

		const res = await authenticateUser(email, password);

		if (res.success) {
			// // spinner shits
			// loading.update((value) => {
			// 	return false;
			// });
			// Successful login, navigate to the home page
			goto('/');
			// loginSucAlert();
		} else {
			// loading.update((value) => {
			// 	return false;
			// });
			// showLoginAlert();
			console.log('cannot login');

			if (res.res.error) {
				formErrors = res.res.error; // Update formErrors with validation errors
			}
			console.log(formErrors);
		}
	}

	export function clickDoctor() {
		goto('/sign-in-doctor');
	}
</script>

<!-- <Header /> -->

<div class="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
	<!-- Changed the background color to white -->
	<!-- <Spinner /> -->
	<div class="max-w-md w-full space-y-8">
		<div>
			<img
				class="mx-auto h-12 w-auto"
				src="https://images.websiteplanet.com/wp-content/uploads/2020/08/9-Best-Z-Logos-and-How-to-Make-Your-Own-for-Free-image1.png"
				alt="Logo"
			/>
			<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
				Sign in to your User account
			</h2>
		</div>
		<form class="mt-8 space-y-6" on:submit={handleUserSubmit}>
			<input type="hidden" name="remember" value="true" />
			<div class="rounded-md shadow-sm -space-y-px">
				<div class="mb-3 bg-black border-2 rounded-md">
					<label for="email-address" class="sr-only">Email address</label>
					<input
						id="email-address"
						name="email"
						type="email"
						autocomplete="email"
						required
						class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Email address"
					/>
					{#if 'email' in formErrors}
						<p class="text-red-500 text-sm mt-1">{formErrors['email']}</p>
					{/if}
				</div>
				<div>
					<label for="password" class="sr-only">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						autocomplete="current-password"
						required
						class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
						placeholder="Password"
					/>
					{#if 'password' in formErrors}
						<p class="text-red-500 text-sm mt-1">{formErrors['password']}</p>
					{/if}
				</div>
			</div>

			<div class="flex items-center justify-between">
				<div class="flex items-center">
					<input
						id="remember-me"
						name="remember-me"
						type="checkbox"
						class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
					/>
					<label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
				</div>

				<div class="text-sm">
					<a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
						Forgot your password?
					</a>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
				>
					<span class="absolute left-0 inset-y-0 flex items-center pl-3">
						<!-- Heroicon name: solid/lock-closed -->
						<svg
							class="h-5 w-5 text-indigo-300 group-hover:text-indigo-200"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fill-rule="evenodd"
								d="M12 2a2 2 0 012 2v5.586l1.293-1.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 7.586V2a2 2 0 012-2zM4 9v9a2 2 0 002 2h8a2 2 0 002-2V9H4z"
								clip-rule="evenodd"
							/>
						</svg>
					</span>
					Sign in
				</button>
			</div>
		</form>
		<button
			class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
			on:click={clickDoctor}>You a Doctor?</button
		>
	</div>
</div>
