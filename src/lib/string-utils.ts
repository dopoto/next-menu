export function obj2str(obj?: object): string {
    return JSON.stringify(obj, null, 2);
}

export function lg(obj?: object) {
    console.log(obj2str(obj));
}

/**
 * Generates a random string of specified length using letters and numbers
 */
export function generateRandomSlug(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}