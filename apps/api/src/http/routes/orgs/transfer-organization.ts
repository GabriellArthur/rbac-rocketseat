import { auth } from "@/http/middlewares/auth";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/utils/get-user-permissions";
import { organizationSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { BadRequestError } from "../_errors/bad-request-error";
import { UnauthorizedError } from "../_errors/unauthorized-error";

export async function transferOrganization(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).patch('/organizations/:slug/owner', {
    schema: {
      tags: ['organizations'],
      summary: 'Transfer the ownership of an organization',
      security: [{ bearerAuth: [] }],
      body: z.object({
        transferToUserId: z.string().uuid(),
      }),
      params: z.object({
        slug: z.string(),
      }),
      response: {
        204: z.null(),
      },
    }
  }, async (request, reply) => {
    const { slug } = request.params;

    const userId = await request.getCurrentUserId();
    const { membership, organization } = await request.getUserMembership(slug.toLowerCase());

    const authOrganization = organizationSchema.parse(organization);

    const { cannot } = getUserPermissions(userId, membership.role);


    if (cannot('transfer_ownership', authOrganization)) {
      throw new UnauthorizedError('You are not allowed to transfer the ownership of this organization');
    }

    const { transferToUserId } = request.body;

    const transferToMembership = await prisma.member.findUnique({
      where: {
        organizationId_userId: {
          organizationId: organization.id,
          userId: transferToUserId,
        }
      },
    });

    if (transferToMembership) {
      throw new BadRequestError('Target user is already a member of this organization');
    }

    await prisma.$transaction([
      prisma.member.update({
        where: {
          organizationId_userId: {
            organizationId: organization.id,
            userId: userId,
          }
        },
        data: {
          role: 'ADMIN',
        },
      }),

      prisma.organization.update({
        where: {
          id: organization.id,
        },
        data: {
          ownerId: transferToUserId,
        },
      })
    ]);

    return reply.status(204).send(null);
  });
}