import { env } from '@saas/env'
import { getCookie, type CookiesFn } from 'cookies-next'
import ky from 'ky'


export const api = ky.create({
  prefixUrl: env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookiesStore: CookiesFn | undefined

        // Server Side
        if (typeof window === 'undefined') {
          const {cookies: serverCookies} = await import('next/headers')

          cookiesStore = serverCookies
        }

        const token = getCookie('token', { cookies: cookiesStore })

        if (token) {
          const processedToken = await token
          request.headers.set('Authorization', `Bearer ${processedToken}`)
        }
      }
    ]
  }
})