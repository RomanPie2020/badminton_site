// helpers/getFieldError.ts
import { FieldError, FieldErrors, FieldValues, Path } from 'react-hook-form'

export function getFieldError<T extends FieldValues>(
	errors: FieldErrors<T>,
	name: Path<T>
): FieldError | undefined {
	const raw = (errors as any)[name]
	if (!raw) return undefined

	if (typeof raw === 'object' && 'message' in raw) {
		return raw as FieldError
	}

	if (typeof name === 'string' && name.includes('.')) {
		const parts = name.split('.')
		let cur: any = errors
		for (const p of parts) {
			if (!cur) return undefined
			cur = cur[p]
		}
		if (cur && typeof cur === 'object' && 'message' in cur) {
			return cur as FieldError
		}
	}

	return undefined
}
