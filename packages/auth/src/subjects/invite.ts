import { z } from "zod";

export const inviteSubjects = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('create'), z.literal('delete')]),
  z.literal('Invite')
])

export type InviteSubjects = z.infer<typeof inviteSubjects>