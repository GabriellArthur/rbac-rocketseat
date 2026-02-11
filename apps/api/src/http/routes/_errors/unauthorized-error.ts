export class UnauthorizedError extends Error {
  readonly statusCode = 401

  constructor(message?: string) {
    super(message ?? 'Unauthorized');
    this.name = 'UnauthorizedError';
  }
}