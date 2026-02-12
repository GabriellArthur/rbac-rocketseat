import { api } from './api-client'

interface GetProjectsResponse {
  projects: {
    description: string | null
    id: string
    name: string
    slug: string
    avatarUrl: string | null
    organizationId: string
    ownerId: string
    owner: {
      id: string
      name: string | null
      avatarUrl: string | null
    }
    createdAt: string
  }[]
}

export async function getProjects(org: string) {
  const result = await api
    .get(`organizations/${org}/projects`)
    .json<GetProjectsResponse>()

  return result
}
