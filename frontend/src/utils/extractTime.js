export function extractTime(dateString) {
    const date = new Date(dateString);
    const today = new Date();  // Get today's date

    // Zero out time components to only compare dates
    today.setHours(0, 0, 0, 0);
    const messageDate = new Date(date);
    messageDate.setHours(0, 0, 0, 0);

    // Extracting date components for the input date
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Extracting time components
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    // Calculate difference in days
    const diffTime = Math.abs(today - messageDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Extracting today's date components
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const currentDay = today.getDate();

    // Define day names for the week
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = dayNames[date.getDay()];

    // Check if the input date is today or within 7 days
    if (diffDays === 0) {
        // Return only the time if it's today
        return `${hours}:${minutes}`;
    } else if (diffDays <= 7) {
        // Return time and day of the week if within 7 days
        return `${dayOfWeek} ${hours}:${minutes}`;
    } else {
        // Return the full date and time otherwise
        const formattedYear = padZero(year % 100); // Formatting year as two digits
        const formattedMonth = padZero(month + 1); // Formatting month correctly
        const formattedDay = padZero(day); // Formatting day

        return `${formattedMonth}/${formattedDay}/${formattedYear} ${hours}:${minutes}`;
    }
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
