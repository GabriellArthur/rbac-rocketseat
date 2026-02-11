import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { rolesSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function getInvites(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/invites', {
    schema: {
      tags: ['invites'],
      summary: 'Get all invites',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          invites: z.array(z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            role: rolesSchema,
            createdAt: z.date(),
            author: z.object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              avatarUrl: z.string().url().nullable(),
            }).nullable(),
          })),
        }),
      },
    }
  }, async (request, reply) => {
    const { slug } = request.params;
    const userId = await request.getCurrentUserId();
    const { membership, organization } = await request.getUserMembership(slug.toLowerCase());

    const { cannot } = getUserPermissions(userId, membership.role);

    if (cannot('get', 'Invite')) {
      throw new UnauthorizedError('You are not allowed to get invites in this organization');
    }

    const invites = await prisma.invite.findMany({
      where: {
        organizationId: organization.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reply.status(200).send({
      invites,
    });

  });
}