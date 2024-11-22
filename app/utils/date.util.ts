class DateServicePrototype {
    getThisWeekRange(): { startDate: Date; endDate: Date } {
        const todayUTC = new Date(); // Current date/time in UTC
        const dayOfWeek = todayUTC.getUTCDay(); // Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    
        // Calculate start of the week (Monday at 00:00:00 UTC)
        const startOfWeek = new Date(todayUTC);
        startOfWeek.setUTCDate(todayUTC.getUTCDate() - ((dayOfWeek + 6) % 7)); // Move back to Monday
        startOfWeek.setUTCHours(4, 59, 0, 0); // Set to 04:59:00 UTC (11:59 EST)
    
        // Calculate end of the week (Sunday at 23:59:59 UTC)
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
        endOfWeek.setUTCHours(23, 59, 59, 999);
    
        return { startDate: startOfWeek, endDate: endOfWeek };
    }

    convertToReadableDateFromUTC(startTimeUTC: string, utcOffset: string): string {
        // Convert UTC start time to a Date object
        const utcDate = new Date(startTimeUTC);
    
        // Parse the UTC offset
        const [offsetHours, offsetMinutes] = utcOffset.split(":").map(Number);
        const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000;
    
        // Adjust for the desired timezone
        const adjustedDate = new Date(utcDate.getTime() + offsetMilliseconds);
    
        // Format the adjusted date
        const readableDate = adjustedDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    
        return readableDate;
    }
    
    convertToReadableDate(dateStr: string): string {
        // Split the input string to extract year, month, and day
        const [year, month, day] = dateStr.split('-').map(Number);
    
        // Create a Date object explicitly in local time
        const date = new Date(year, month - 1, day); // month is 0-indexed in Date
    
        // Format the date as a readable string
        const formattedDate = date.toLocaleDateString('en-US', {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    
        return formattedDate;
    }
    
}

export const DateService = new DateServicePrototype();
