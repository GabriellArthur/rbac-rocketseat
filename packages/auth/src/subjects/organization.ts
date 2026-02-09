import { z } from "zod";

export const organizationSubjects = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('create'), z.literal('transfer_ownership'), z.literal('update'), z.literal('delete')]),
  z.literal('Organization')
])

export type OrganizationSubjects = z.infer<typeof organizationSubjects>