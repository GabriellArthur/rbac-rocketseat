import { HTTPError } from 'ky';
import { api } from './api-client';

interface CreateOrganizationRequest {
  name: string
  domain: string | null
  shouldAttachUsersByDomain: boolean
}

interface CreateOrganizationResponse {
  token: string
}

export class CreateOrganizationError extends Error {
  constructor(message?: string) {
    super(message ?? 'Sign in with password failed');
    this.name = 'CreateOrganizationError';
  }
}

export async function createOrganization({
  name,
  domain,
  shouldAttachUsersByDomain,
}: CreateOrganizationRequest) {
  try {
    const result = await api
      .post('organizations', {
        json: {
          name,
          domain,
          shouldAttachUsersByDomain,
        },
      })
      .json<CreateOrganizationResponse>()

    return result
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json()
      throw new CreateOrganizationError(message)
    }

    throw new CreateOrganizationError('Unexpected error, try again in a few minutes.')
  }
}
