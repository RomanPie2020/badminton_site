export const getToday = (): string => {
	return new Date().toISOString().slice(0, 10)
}

export const getTomorrow = (): string => {
	const tomorrow = new Date()
	tomorrow.setDate(tomorrow.getDate() + 1)
	return tomorrow.toISOString().slice(0, 10)
}

export const getThisWeek = () => {
	const now = new Date()
	const day = now.getDay() || 7 // 1 (пон) ... 7 (нд)
	const monday = new Date(now)
	monday.setDate(now.getDate() - (day - 1))
	const sunday = new Date(monday)
	sunday.setDate(monday.getDate() + 6)

	return {
		from: monday.toISOString().slice(0, 10),
		to: sunday.toISOString().slice(0, 10),
	}
}

export const getNext7Days = () => {
	const now = new Date()
	const next7 = new Date(now)
	next7.setDate(now.getDate() + 6)

	return {
		from: now.toISOString().slice(0, 10),
		to: next7.toISOString().slice(0, 10),
	}
}

export const getNextMonth = () => {
	const now = new Date()
	const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
	const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0)

	return {
		from: startOfNextMonth.toISOString().slice(0, 10),
		to: endOfNextMonth.toISOString().slice(0, 10),
	}
}

export type DateRange = {
	from: string | null
	to: string | null
}
