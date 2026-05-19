export function sanitizeReason(reason: string) {
    return reason
        .replace(/[\r\n]/g, ' ')
        .trim()
        .slice(0, 180);
}
