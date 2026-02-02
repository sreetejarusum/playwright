/**
 * Reusable Date Utility class for common date operations.
 */
export class DateUtils {
    /**
     * Gets the current date in the specified format.
     * @param format Date format (e.g., 'YYYY-MM-DD', 'DD/MM/YYYY'). Defaults to 'YYYY-MM-DD'.
     */
    static getCurrentDate(format: string = 'YYYY-MM-DD'): string {
        return this.formatDate(new Date(), format);
    }

    /**
     * Gets a date in the future.
     * @param days Number of days to add.
     * @param format Date format.
     */
    static getFutureDate(days: number, format: string = 'YYYY-MM-DD'): string {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return this.formatDate(date, format);
    }

    /**
     * Gets a date from the past.
     * @param days Number of days to subtract.
     * @param format Date format.
     */
    static getPastDate(days: number, format: string = 'YYYY-MM-DD'): string {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return this.formatDate(date, format);
    }

    /**
     * Formats a Date object into a string.
     * Supported tokens: YYYY, MMM, MM, DD, HH, mm, ss
     */
    static formatDate(date: Date, format: string): string {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const values: { [key: string]: string | number } = {
            YYYY: date.getFullYear(),
            MMM: monthNames[date.getMonth()],
            MM: String(date.getMonth() + 1).padStart(2, '0'),
            DD: String(date.getDate()).padStart(2, '0'),
            HH: String(date.getHours()).padStart(2, '0'),
            mm: String(date.getMinutes()).padStart(2, '0'),
            ss: String(date.getSeconds()).padStart(2, '0')
        };

        // Sort keys by length descending to prevent partial matches (e.g., MMM before MM)
        const tokens = Object.keys(values).sort((a, b) => b.length - a.length);
        const regex = new RegExp(tokens.join('|'), 'g');

        return format.replace(regex, match => String(values[match]));
    }

    /**
     * Gets current timestamp in milliseconds.
     */
    static getTimeStamp(): number {
        return Date.now();
    }

    /**
     * Calculates the difference in days between two dates.
     */
    static getDaysDifference(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Gets the first day of the month for a given date.
     */
    static getFirstDayOfMonth(date: Date = new Date()): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    /**
     * Gets the last day of the month for a given date.
     */
    static getLastDayOfMonth(date: Date = new Date()): Date {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    /**
     * Formats a date specifically for file naming (e.g., for screenshots).
     * Returns format: YYYYMMDD_HHmmss
     */
    static getFileSafeTimestamp(): string {
        return this.formatDate(new Date(), 'YYYYMMDD_HHmmss');
    }
}
