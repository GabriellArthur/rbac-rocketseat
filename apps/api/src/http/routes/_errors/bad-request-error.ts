export class BadRequestError extends Error {
  readonly statusCode = 400

  constructor(message?: string) {
    super(message ?? 'Bad Request');
    this.name = 'BadRequestError';
  }
}