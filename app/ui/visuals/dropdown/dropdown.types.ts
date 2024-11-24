export interface DropdownProps<T> {
	label?: string
	value: T
	options: Array<DropdownOptionProps<T>>
	onSelect: (selectedOptions: T) => void
	style?: React.CSSProperties
	className?: string
}

export interface DropdownOptionProps<T> {
	value: T
	label: string
}
