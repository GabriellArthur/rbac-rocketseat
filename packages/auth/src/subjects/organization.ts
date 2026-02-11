import { z } from "zod";
import { organizationSchema } from "../models/organization";

export const organizationSubjects = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('create'), z.literal('transfer_ownership'), z.literal('update'), z.literal('delete')]),
  z.union([z.literal('Organization'), organizationSchema])
])

export type OrganizationSubjects = z.infer<typeof organizationSubjects>