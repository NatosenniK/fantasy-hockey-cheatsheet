export function roundToDecimal(value: number, digits: number): number {
    const tenToN = 10 ** digits
    return Math.round(value * tenToN) / tenToN
}