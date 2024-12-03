export function playerPosition(pos: string) {
	switch (pos) {
		case 'L':
			return 'LW'
		case 'R':
			return 'RW'
		default:
			return pos
	}
}
export function playerSlot(pos: string) {
	switch (pos) {
		case 'L':
			return 'F'
		case 'R':
			return 'F'
		case 'C':
			return 'F'
		default:
			return pos
	}
}
