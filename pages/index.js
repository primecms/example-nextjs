import React from 'react'
import gql from 'graphql-tag'
import Link from 'next/link'
import { Query } from 'react-apollo'
import { format } from 'date-fns'

export const query = gql`
  query {
    allBlog {
      edges {
        node {
          _meta {
            updatedAt
          }
          id
          title
          body
        }
      }
    }
  }
`


const BlogPost = ({ node }) => {
  return (
    <div key={node.id}>
      <time dateTime={node._meta.updatedAt}>{format(node._meta.updatedAt, 'MM/DD/YYYY')}</time>
      <h3><Link as={`/blog/${node.id}`} href={`/blog?id=${node.id}`}><a>{node.title}</a></Link></h3>
    </div>
  );
}


export default class Index extends React.Component {
  componentDidMount() {
    if (typeof window !== 'undefined') {
      const query = window.location.search
        .substr(1)
        .split('&')
        .reduce((acc, item) => {
          const [key, value] = item.split('=').map(decodeURIComponent);
          acc[key] = value;
          return acc;
        }, {});
      const endpoint = 'https://example-prime.herokuapp.com';
      if (query['prime.id']) {
        const url = `${endpoint}/prime/preview?id=${query['prime.id']}`;
        fetch(url, { credentials: 'include' }).then(r => r.json())
        .then(res => {
          document.cookie = 'prime.accessToken=' + res.accessToken;
          document.cookie = 'prime.preview=' + res.document.id;
          window.location = '/';
        })
      }
    }
  }
  
  render () {
    return (
      <div>
        <h1>Blog posts</h1>
        <Query query={query}>
          {({ loading, error, data }) => {
            if (error) return <div>error</div>;
            if (loading) return <div>Loading</div>;
            return data.allBlog.edges.map(BlogPost);
          }}
        </Query>
      </div>
    )
  }
}
