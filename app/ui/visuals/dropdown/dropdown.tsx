import { useEffect, useRef, useState } from 'react'
import { DropdownProps } from './dropdown.types'

function Dropdown<T>(props: DropdownProps<T>) {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const handleSelect = (selectedValue: T) => {
		props.onSelect(selectedValue)

		// Close the dropdown
		setIsOpen(false)
	}

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false)
		}
	}

	// Get the current label based on the selected value
	const currentLabel =
		props.value !== null && props.value !== undefined
			? props.options.find((option) => option.value === props.value)?.label || props.label
			: props.label || 'Select an option'

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [])

	return (
		<div ref={dropdownRef} className={`relative inline-block text-left ${props.className ? props.className : ''}`}>
			<button
				className="inline-flex justify-center w-full rounded-md border border-slate-600 h-10 shadow-sm px-4 py-2 text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				onClick={() => setIsOpen(!isOpen)}
			>
				{currentLabel}
				<svg
					className="-mr-1 ml-2 h-5 w-5"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fillRule="evenodd"
						d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
						clipRule="evenodd"
					/>
				</svg>
			</button>
			{isOpen && (
				<div
					className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-slate-700 text-white ring-1 ring-black ring-opacity-5 focus:outline-none"
					role="menu"
					aria-orientation="vertical"
				>
					<div className="py-1" role="none">
						{props.options.map((option, index) => (
							<div
								key={index}
								onClick={(e) => {
									e.preventDefault()
									handleSelect(option.value)
								}}
								className={`text-white block px-4 py-2 text-sm hover:bg-gray-600 ${
									props.value === option.value ? 'bg-gray-500' : ''
								}`}
								role="menuitem"
							>
								{option.label}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default Dropdown
