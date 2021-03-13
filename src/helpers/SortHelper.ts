export function asort(data, field) {
	const result = [...data];
	return result.sort((a, b) => a[field] > b[field] ? 1 : (b[field] > a[field] ? -1 : 0));
}

export function dsort(data, field) {
	const result = [...data];
	return result.sort((a, b) => a[field] < b[field] ? 1 : (b[field] < a[field] ? -1 : 0));
}
