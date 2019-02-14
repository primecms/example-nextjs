import React from 'react'
import gql from 'graphql-tag'
import Link from 'next/link'
import { Query } from 'react-apollo'
import { format } from 'date-fns'
import { withRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'

export const query = gql`
  query Blog($id: ID!) {
    Blog(id: $id) {
      _meta {
        updatedAt
      }
      id
      title
      body
    }
  }
`;

const Blog = withRouter((props) => (
  <Query query={query} variables={{ id: props.router.query.id }}>
    {({ loading, error, data: { Blog } }) => {
      if (loading) return <div>Loading</div>;
      if (error || !Blog) return <div>error</div>;
      return (
        <div>
          <time dateTime={Blog._meta.updatedAt}>{format(Blog._meta.updatedAt, 'MM/DD/YYYY')}</time>
          <h1>{Blog.title}</h1>
          <ReactMarkdown source={Blog.body} />
          <Link href="/"><a>Go back</a></Link>
        </div>
      );
    }}
  </Query>
))

export default Blog