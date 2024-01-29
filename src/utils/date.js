export function formatDateTime(date) {
	// Check if the input is a string and convert it to a Date object
	const parsedDate = typeof date === 'string' ? new Date(date) : date;

	const options = {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: false,
		timeZone: 'UTC' // Ensure it uses UTC time
	};

	return new Intl.DateTimeFormat('en-GB', options).format(parsedDate);
}
