import type { Roles } from '@saas/auth'

import { api } from './api-client'

interface GetInviteResponse {
  invites: {
    id: string
    email: string
    role: Roles
    createdAt: string
    author: {
      id: string
      name: string | null
      avatarUrl: string | null
    } | null
  }[]
}

export async function getInvites(org: string) {
  const result = await api
    .get(`organizations/${org}/invites`, {
      next: {
        tags: [`${org}/invites`],
      },
    })
    .json<GetInviteResponse>()

  return result
}
