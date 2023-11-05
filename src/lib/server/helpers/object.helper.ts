export function excludeProperties<T extends object>(object: T, properties: (keyof T)[]) {
	return Object.fromEntries(
		Object.entries(object).filter(([key]) => !properties.includes(key as keyof T))
	);
}
