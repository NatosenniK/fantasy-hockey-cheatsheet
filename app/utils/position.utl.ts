export function playerPosition(pos: string) {
    switch (pos) {
        case 'L':
            return "LW"
        case 'R':
            return "RW"
        default:
          return pos
      }
}