import { auth } from "@/http/middlewares/auth";
import { rolesSchema } from "@saas/auth";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export async function getMembership(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().register(auth).get('/organizations/:slug/membership', {
    schema: {
      tags: ['organizations'],
      summary: 'Get the membership of the current user',
      security: [{ bearerAuth: [] }],
      params: z.object({
        slug: z.string(),
      }),
      response: {
        200: z.object({
          membership: z.object({
            id: z.string().uuid(),
            role: rolesSchema,
            organizationId: z.string().uuid(),
          }),
        }),
      },
    }
  }, async (request, reply) => {
    const { slug } = request.params;
    const { membership } = await request.getUserMembership(slug.toLowerCase());

    return reply.status(200).send({
      membership: {
        id: membership.id,
        role: rolesSchema.parse(membership.role),
        organizationId: membership.organizationId,
      }
    });
  });
}