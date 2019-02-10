import React from 'react'
import gql from 'graphql-tag'
import Link from 'next/link'
import { Query } from 'react-apollo'
import { format } from 'date-fns'
import { isPreviewing, clearPreview } from 'apollo-link-prime';

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
  render () {
    return (
      <div>
        <h1>Blog posts</h1>
        <Query query={query} fetchPolicy="network-only">
          {({ loading, error, data }) => {
            if (error) return <div>error</div>;
            if (loading) return <div>Loading</div>;
            return data.allBlog.edges.map(BlogPost);
          }}
        </Query>
        {isPreviewing() && <button onClick={clearPreview}>Clear preview</button>}
      </div>
    )
  }
}
