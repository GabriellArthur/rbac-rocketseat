import type { Roles } from '@saas/auth';
import { api } from './api-client';

interface GetMembershipResponse {
  membership: {
    id: string;
    role: Roles,
    organizationId: string;
    userId: string;
  }
}


export async function getMembership(slug: string) {
  const result = await api
    .get(`organizations/${slug}/membership`)
    .json<GetMembershipResponse>()

  return result
}
