import { AbilityBuilder, createMongoAbility, type CreateAbility, type MongoAbility } from "@casl/ability";
import z from "zod";
import type { User } from "./models/user";
import { permissions } from "./permissions";
import { billingSubjects } from "./subjects/billing";
import { inviteSubjects } from "./subjects/invite";
import { organizationSubjects } from "./subjects/organization";
import { projectSubjects } from "./subjects/project";
import { userSubjects } from "./subjects/user";

const appAbilitiesSchema = z.union([
  userSubjects,
  projectSubjects,
  organizationSubjects,
  inviteSubjects,
  billingSubjects,
  z.tuple([z.literal('manage'), z.literal('all')])
])

type AppAbilities = z.infer<typeof appAbilitiesSchema>

export type AppAbility = MongoAbility<AppAbilities>;
export const createAppAbility = createMongoAbility as CreateAbility<AppAbility>;

export function defineAbilityFor(user: User) {
  const builder = new AbilityBuilder<AppAbility>(createAppAbility);

  if (!permissions[user.role]) {
    throw new Error(`Permission for role ${user.role} not found.`);
  }

  permissions[user.role](user, builder);

  const ability = builder.build();

  return ability;
}