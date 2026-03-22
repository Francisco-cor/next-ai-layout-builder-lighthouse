import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'

// RSC client — one instance per request, no shared state
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_SANITY_GRAPHQL_ENDPOINT,
      headers: {
        Authorization: `Bearer ${process.env.SANITY_API_TOKEN}`,
      },
      // Next.js fetch with ISR revalidation
      fetchOptions: { next: { revalidate: 60 } },
    }),
  })
})
