import { HTTPError } from 'ky'

import { api } from './api-client'

interface SignInWithGithubRequest {
  code: string
}

interface SignInWithGithubResponse {
  token: string
}

export class SignInWithGithubError extends Error {
  constructor(message?: string) {
    super(message ?? 'Sign in with password failed')
    this.name = 'SignInWithGithubError'
  }
}

export async function signInWithGithub({ code }: SignInWithGithubRequest) {
  try {
    const result = await api
      .post('sessions/github', {
        json: {
          code,
        },
      })
      .json<SignInWithGithubResponse>()

    return result
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      throw new SignInWithGithubError(message)
    }

    throw new SignInWithGithubError(
      'Unexpected error, try again in a few minutes.',
    )
  }
}
