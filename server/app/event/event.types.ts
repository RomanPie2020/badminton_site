export interface Filters {
	eventType?: string[] // Наприклад: ['Турнір', 'Тренування']
	dateFrom?: string // Наприклад: '2025-06-01'
	dateTo?: string // Наприклад: '2025-06-07'
	gameType?: string[] // Наприклад: ['Одиночна', 'Парна']
	levelOfPlayers?: string[] // Наприклад: ['Новачок', 'Просунутий']
}
