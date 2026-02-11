import { z } from "zod";
import { userSchema } from "../models/user";

export const userSubjects = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('update'), z.literal('delete')]),
  z.union([z.literal('User'), userSchema])
])

export type UserSubjects = z.infer<typeof userSubjects>