export const snakeToCamel = (obj: any): any => {
	if (Array.isArray(obj)) {
		return obj.map(snakeToCamel)
	} else if (obj !== null && typeof obj === 'object') {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => [
				key.replace(/_([a-z])/g, g => g[1].toUpperCase()),
				snakeToCamel(value),
			])
		)
	}
	return obj
}
export const camelToSnake = (obj: any): any => {
	if (Array.isArray(obj)) {
		return obj.map(camelToSnake)
	} else if (obj !== null && typeof obj === 'object') {
		return Object.fromEntries(
			Object.entries(obj).map(([key, value]) => [
				key.replace(/([A-Z])/g, g => `_${g.toLowerCase()}`),
				camelToSnake(value),
			])
		)
	}
	return obj
}
