export const sanitizeReason = (reason: string) => reason.replace(/[\r\n]/g, ' ').trim().slice(0, 180);
