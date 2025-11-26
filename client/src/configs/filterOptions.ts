export const FILTER_CATEGORIES = [
	{ key: 'events', label: 'Події' },
	{ key: 'date', label: 'Дата і час' },
	{ key: 'typeOfGame', label: 'Тип гри' },
	{ key: 'levelOfPlayers', label: 'Рівень гравців' },
] as const

export const EVENT_OPTIONS = [
	'Турнір',
	'Тренування',
	'Дружня гра',
	'Приватна гра',
	'Клубний захід',
] as const

export const GAME_TYPE_OPTIONS = [
	'Одиночна',
	'Парна',
	'Змішана парна',
	'Командна',
] as const

export const LEVEL_OPTIONS = [
	'Новачок',
	'Середній',
	'Просунутий',
	'Профі',
] as const
