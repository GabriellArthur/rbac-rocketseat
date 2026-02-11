import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

type ErrorWithStatusCode = Error & { statusCode?: number };

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      error: 'Validation error',
      errors: error.flatten().fieldErrors,
    });
  }

  const err = error as ErrorWithStatusCode;
  if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode < 500) {
    return reply.status(err.statusCode).send({
      error: err.message,
    });
  }

  console.error(error);

  // send error to some observability platform

  return reply.status(500).send({
    message: 'Internal server error',
  });
}