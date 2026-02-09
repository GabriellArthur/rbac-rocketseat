import { z } from "zod";

export const billingSubjects = z.tuple([
  z.union([z.literal('manage'), z.literal('get'), z.literal('export')]),
  z.literal('Billing')
])

export type BillingSubjects = z.infer<typeof billingSubjects>