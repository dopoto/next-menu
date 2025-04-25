export class AppError extends Error {
    constructor(public readonly data: { internalMessage: string; publicMessage?: string }) {
        super(data.internalMessage);
        this.name = 'AppError';
    }
} 