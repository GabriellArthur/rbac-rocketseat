import { z } from "zod";

export const projectSubjects = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('create'), z.literal('update'), z.literal('delete')]),
  z.literal('Project')
])

export type ProjectSubjects = z.infer<typeof projectSubjects>