/**
 * Generates a unique order number using a timestamp and random characters
 * In a real implementation, this would be handled by the database
 */
export function generateUniqueOrderNumber(): string {
    const timestamp = new Date().getTime().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}${randomStr}`;
}
