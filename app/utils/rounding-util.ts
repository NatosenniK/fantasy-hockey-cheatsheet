

class RoundingServicePrototype {
    roundToDecimal(value: number, digits: number): number {
        const tenToN = 10 ** digits
        return Math.round(value * tenToN) / tenToN
    }
    
    roundValue(value: number): number {
        return Math.round(value * 100) / 100; // Example: round to 2 decimal places
    }
}

export const RoundingService = new RoundingServicePrototype();