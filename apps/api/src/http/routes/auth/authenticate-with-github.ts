import { prisma } from "@/lib/prisma";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { UnauthorizedError } from "../_errors/unauthorized-error";
import { env } from "@saas/env";

export async function authenticateWithGithub(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post('/sessions/github', {
    schema: {
      tags: ['auth'],
      summary: 'Authenticate with Github',
      body: z.object({
        code: z.string(),
      }),
      response: {
        201: z.object({
          access_token: z.string(),
        }),
      },
    }
  }, async (request, reply) => {
    const { code } = request.body;

    const githubOAuthUrl = new URL('https://github.com/login/oauth/access_token');
    githubOAuthUrl.searchParams.set('client_id', env.GITHUB_OAUTH_CLIENT_ID ?? '');
    githubOAuthUrl.searchParams.set('client_secret', env.GITHUB_OAUTH_CLIENT_SECRET ?? '');
    githubOAuthUrl.searchParams.set('redirect_uri', env.GITHUB_OAUTH_CLIENT_REDIRECT_URI ?? '');
    githubOAuthUrl.searchParams.set('code', code);

    const githubAccessTokenResponse = await fetch(githubOAuthUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const githubAccessTokenData = await githubAccessTokenResponse.json();
    const {access_token: accessToken} = z.object({
      access_token: z.string(),
      token_type: z.literal('bearer'),
      scope: z.string(),
    }).parse(githubAccessTokenData);

    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const githubUserData = await githubUserResponse.json();
    const {id: githubId, name, email, avatar_url: avatarUrl} = z.object({
      id: z.number().int().transform(String),
      avatar_url: z.string().url().nullable(),
      email: z.string().email().nullable(),
      name: z.string().nullable(),
    }).parse(githubUserData);

    if (email === null) {
      throw new UnauthorizedError('Your github account must have an email to authenticate');
    }

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          avatarUrl,
        },
      });
    } 

    let account = await prisma.account.findUnique({
      where: {
        provider_userId: {
          provider: 'GITHUB',
          userId: user.id,
        },
      },
    });

    if (!account) {
      account = await prisma.account.create({
        data: {
          provider: 'GITHUB',
          providerAccountId: githubId,
          userId: user.id,
        },
      });
    }

    const token = await reply.jwtSign({
      sub: user.id,
    }, {
      sign: {
        expiresIn: '7d',
      }
    });

    return reply.status(201).send({
      access_token: token,
    });
  });
}