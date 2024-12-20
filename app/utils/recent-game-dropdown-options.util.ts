import { DropdownOptionProps } from '../ui/visuals/dropdown/dropdown.types'

export function getRecentGameOptions(): DropdownOptionProps<number>[] {
	return [
		{ value: 5, label: 'Last 5 Games' },
		{ value: 10, label: 'Last 10 Games' },
		{ value: 0, label: 'Full Season' },
	]
}
