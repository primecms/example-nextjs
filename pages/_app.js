import App, { Container } from 'next/app'
import React from 'react'
import { ApolloProvider } from 'react-apollo'
import withApollo from '../lib/withApollo'

class MyApp extends App {

  onClick = () => {
    document.cookie = 'prime.accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    document.cookie = 'prime.preview=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    window.location.reload();
    this.props.apolloClient.cache.reset();
  }

  render () {
    const { Component, pageProps, apolloClient, cookies } = this.props
    const preview = cookies && cookies['prime.preview'];
    
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
          {!!preview && <button onClick={this.onClick}>Clear preview</button>}
        </ApolloProvider>
      </Container>
    )
  }
}

export default withApollo(MyApp)
