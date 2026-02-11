import type { AbilityBuilder } from "@casl/ability";
import type { AppAbility } from "./index";
import type { User } from "./models/user";
import type { Roles } from "./roles";

type PermissionsByRole = (user: User, builder: AbilityBuilder<AppAbility>) => void

export const permissions: Record<Roles, PermissionsByRole> = {
  ADMIN: (user, { can, cannot }) => {
    can('manage', 'all');

    cannot(['transfer_ownership', 'update'], 'Organization');
    can(['transfer_ownership', 'update'], 'Organization', {
      ownerId: { $eq: user.id },
    });
  },
  MEMBER: (user, { can }) => {
    can('get', 'User');
    can(['create', 'get'], 'Project');
    can(['update', 'delete'], 'Project', {
      ownerId: { $eq: user.id },
    });
  },
  BILLING: (_, { can }) => {
    can('manage', 'Billing');
  },
}