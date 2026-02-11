import { HTTPError } from 'ky';
import { api } from './api-client';

interface SignUpRequest {
  email: string
  password: string
  name: string
}

type SignUpResponse = void

export class SignUpError extends Error {
  constructor(message?: string) {
    super(message ?? 'Sign up failed');
    this.name = 'SignUpError';
  }
}

export async function signUp({
  name,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  try {
    await api
      .post('users', {
        json: {
          name,
          email,
          password,
        },
      })
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      throw new SignUpError(message)
    }

    throw new SignUpError('Unexpected error, try again in a few minutes.')
  }
}
