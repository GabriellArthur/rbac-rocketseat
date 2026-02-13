import { HTTPError } from 'ky'

import { api } from './api-client'

interface SignInWithPasswordRequest {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  token: string
}

export class SignInWithPasswordError extends Error {
  constructor(message?: string) {
    super(message ?? 'Sign in with password failed')
    this.name = 'SignInWithPasswordError'
  }
}

export async function signInWithPassword({
  email,
  password,
}: SignInWithPasswordRequest) {
  try {
    const result = await api
      .post('sessions/password', {
        json: {
          email,
          password,
        },
      })
      .json<SignInWithPasswordResponse>()

    return result
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      throw new SignInWithPasswordError(message)
    }

    throw new SignInWithPasswordError(
      'Unexpected error, try again in a few minutes.',
    )
  }
}
