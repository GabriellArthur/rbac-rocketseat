import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMembership } from '@/http/get-membership'
import { getProfile } from '@/http/get-profile'
import { defineAbilityFor } from '@saas/auth'

export async function isAuthenticated() {
  const token = (await cookies()).get('token')?.value

  return !!token
}

export async function getCurrentOrg() {
  const org = (await cookies()).get('org')?.value

  return org ?? null
}

export async function getCurrentMembership() {
  const org = await getCurrentOrg()

  if (!org) {
    return null
  }

  const { membership } = await getMembership(org)

  return membership
}

export async function ability() {
  const membership = await getCurrentMembership()

  if (!membership) {
    return null
  }

  const ability = defineAbilityFor({
    __typename: 'User',
    id: membership.userId,
    role: membership.role,
  })

  return ability
}

export async function auth() {
  const token = (await cookies()).get('token')?.value

  if (!token) {
    redirect('/auth/sign-in')
  }

  try {
    const { user } = await getProfile()

    return { user }
  } catch (error) {
    console.error(error)
  }

  redirect('/api/auth/sign-out')
}