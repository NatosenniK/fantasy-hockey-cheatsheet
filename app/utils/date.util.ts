class DateServicePrototype {
    getThisWeekRange(): { startDate: Date; endDate: Date } {
        const todayUTC = new Date(); // Current time in UTC
        const utcDay = todayUTC.getUTCDay(); // Get the day of the week (UTC)
        const startOfWeekUTC = new Date(todayUTC); 
        const endOfWeekUTC = new Date(todayUTC);

        // Calculate start of the week (Sunday at 23:59:59 UTC)
        startOfWeekUTC.setUTCDate(todayUTC.getUTCDate() - utcDay);
        startOfWeekUTC.setUTCHours(23, 59, 59, 999);

        // Calculate end of the week (Sunday at 23:59:59 UTC)
        endOfWeekUTC.setUTCDate(startOfWeekUTC.getUTCDate() + 6);
        endOfWeekUTC.setUTCHours(23, 59, 59, 999);

        // Convert to Eastern Time (UTC-5)
        const offsetHours = -5; // Eastern Standard Time
        const startDate = new Date(startOfWeekUTC.getTime() + offsetHours * 60 * 60 * 1000);
        const endDate = new Date(endOfWeekUTC.getTime() + offsetHours * 60 * 60 * 1000);

        return {
            startDate,
            endDate,
        };
    }
}

export const DateService = new DateServicePrototype();
