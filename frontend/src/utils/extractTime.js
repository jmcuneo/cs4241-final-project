export function extractTime(dateString) {
    const date = new Date(dateString);

    // Extracting date components
    const year = padZero(date.getFullYear() % 100); // Get last two digits of year
    const month = padZero(date.getMonth() + 1); // Get month (0-11) so add 1
    const day = padZero(date.getDate()); // Get day of the month

    // Extracting time components
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());

    // Return the formatted date and time string
    return `${month}/${day}/${year} ${hours}:${minutes}`;
}

// Helper function to pad single-digit numbers with a leading zero
function padZero(number) {
    return number.toString().padStart(2, "0");
}
