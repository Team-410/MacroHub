export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}