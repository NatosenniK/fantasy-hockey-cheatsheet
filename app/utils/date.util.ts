class DateServicePrototype {
    getThisWeekRange(): { startDate: Date; endDate: Date } {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(startOfWeek); 1 

        // Calculate Sunday by adding 7 days to the start of the week
        endOfWeek.setDate(endOfWeek.getDate() + 7);  

        // Set the time to the end of the day
        endOfWeek.setHours(23, 59, 59, 999); 

        return {
            startDate: startOfWeek,
            endDate: endOfWeek,
        };
    }
}

export const DateService = new DateServicePrototype();