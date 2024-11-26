class DateServicePrototype {
	getThisWeekRange(): { startDate: Date; endDate: Date } {
		const todayUTC = new Date() // Current date/time in UTC
		const dayOfWeek = todayUTC.getUTCDay()

		// Calculate start of the week (Monday at midnight Eastern Time)
		const startOfWeek = new Date(todayUTC)
		startOfWeek.setUTCDate(todayUTC.getUTCDate() - ((dayOfWeek + 6) % 7)) // Move back to Monday
		startOfWeek.setUTCHours(5, 0, 0, 0) // Set to 05:00 UTC (12:00 AM EST)

		// Calculate end of the week (Sunday at 11:59:59 PM Eastern Time)
		const endOfWeek = new Date(startOfWeek)
		endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 7)
		endOfWeek.setUTCHours(4, 59, 59, 999)

		return { startDate: startOfWeek, endDate: endOfWeek }
	}

	convertToReadableDateFromUTC(startTimeUTC: string, utcOffset: string): string {
		// Convert UTC start time to a Date object
		const utcDate = new Date(startTimeUTC)

		// Parse the UTC offset
		const [offsetHours, offsetMinutes] = utcOffset.split(':').map(Number)
		const offsetMilliseconds = (offsetHours * 60 + offsetMinutes) * 60 * 1000

		// Adjust for the desired timezone
		const adjustedDate = new Date(utcDate.getTime() + offsetMilliseconds)

		// Format the adjusted date
		const readableDate = adjustedDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})

		return readableDate
	}

	convertToReadableDate(dateStr: string): string {
		// Split the input string to extract year, month, and day
		const [year, month, day] = dateStr.split('-').map(Number)

		// Create a Date object explicitly in local time
		const date = new Date(year, month - 1, day) // month is 0-indexed in Date

		// Format the date as a readable string
		const formattedDate = date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})

		return formattedDate
	}
}

export const DateService = new DateServicePrototype()
