/**
 * Utility class for string formatting following SRP (Single Responsibility Principle).
 */
export class StringFormatter {
    /**
     * Formats a raw numeric string into a Mexican phone format: XXX-XXX-XX-XX
     * @param value Raw string input
     * @returns Formatted string
     */
    static formatMexicanPhone(value: string): string {
        // Remove all non-digits
        const clean = value.replace(/\D/g, '').slice(0, 10);
        
        // Apply segments: 3 3-2-2
        if (clean.length <= 3) return clean;
        
        const part1 = clean.slice(0, 3);
        const part2 = clean.slice(3, 6);
        const part3 = clean.slice(6, 8);
        const part4 = clean.slice(8, 10);
        
        let result = part1;
        if (clean.length > 3) result += " " + part2;
        if (clean.length > 6) result += "-" + part3;
        if (clean.length > 8) result += "-" + part4;
        
        return result;
    }

    /**
     * Cleans a formatted string back to raw digits
     */
    static toRawDigits(value: string): string {
        return value.replace(/\D/g, '');
    }
}
