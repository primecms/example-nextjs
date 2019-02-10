import { ApolloClient, InMemoryCache } from 'apollo-boost';
import { PrimeLink } from 'apollo-link-prime';
import fetch from 'isomorphic-unfetch';

const endpoint = 'https://example-prime.herokuapp.com'

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create (initialState, { cookies }) {
  // const httpLink = createHttpLink({
  //   uri: `${endpoint}/graphql`,
  //   credentials: 'same-origin'
  // })

  // const primeLink = setContext(async (_, { headers }) => {
  //   return {
  //     headers: {
  //       ...headers,
  //       ...cookies['prime.accessToken'] && { 'x-prime-token': cookies['prime.accessToken'] },
  //       ...cookies['prime.preview'] && { 'x-prime-preview': cookies['prime.preview'] },
  //     }
  //   }
  // })

  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: PrimeLink({
      url: endpoint,
      ssrMode: true,
      cookies,
    }),
    cache: new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo (initialState, options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, options)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, options)
  }

  return apolloClient
}
