import { HTTPError } from 'ky'

import { api } from './api-client'

interface CreateProjectRequest {
  org: string
  name: string
  description: string
}

interface CreateProjectResponse {
  projectId: string
}

export class CreateProjectError extends Error {
  constructor(message?: string) {
    super(message ?? 'Sign in with password failed')
    this.name = 'CreateProjectError'
  }
}

export async function createProject({
  org,
  name,
  description,
}: CreateProjectRequest) {
  try {
    const result = await api
      .post(`organizations/${org}/projects`, {
        json: {
          name,
          description,
        },
      })
      .json<CreateProjectResponse>()

    return result
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      throw new CreateProjectError(message)
    }

    throw new CreateProjectError(
      'Unexpected error, try again in a few minutes.',
    )
  }
}
