import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

import Button from '../../elements/Button';

// kubectl
const ListDeploymentVersions = gql`
  query ListDeployments {
    deployments {
      image
    }
  }
`;

const repos = [
  'amneacsu/k8s-graphql-bindings',
];

const ListPullRequests = gql`
  query ListPullRequests($repo: String!) {
    pullRequests(repo: $repo) {
      id
      number
      title
      body
      issueId
      progress
      headRefName
      baseRefName
      html_url
    }
  }
`;

const MergePullRequest = gql`
  mutation MergePullRequest($repo: String!, $number: Int!) {
    merge(repo: $repo, number: $number) {
      id
    }
  }
`;

const OneRepo = ({ repo }) => {
  const variables = {
    repo,
  };

  return (
    <React.Fragment>
      <h1>kube</h1>

      <Query query={ListDeploymentVersions}>
        {({ data, loading }) => {
          if (loading) {
            return null;
          }

          // const data = data;
          console.log(data);
          return (
            <pre>
              a
              {/* {JSON.stringify(data, null, 2)} */}
            </pre>
          );
        }}
      </Query>

      <h1>{repo}</h1>

      <Query query={ListPullRequests} variables={variables}>
        {({ data, loading, error }) => {
          if (loading) {
            return 'loading...';
          }

          if (error) {
            console.error(error);
            return error.message;
          }

          if (data.pullRequests.length === 0) {
            return 'no PRs';
          }

          return data.pullRequests.map((pr) => (
            <div key={pr.id}>
              <h3>#{pr.number} - {pr.title}</h3>
              <div>
                {pr.issueId
                  ? <strong>{pr.issueId}</strong>
                  : "no JIRA issue"
                } / {`${pr.progress ? 'Checklist: ' + ~~(pr.progress * 100) + '%' : 'no checklist'} / merge ${pr.headRefName} into ${pr.baseRefName}`}
              </div>

              <a href={pr.html_url} target="_blank">
                {pr.html_url}
              </a>

              <br />

              <Mutation mutation={MergePullRequest} variables={{ repo, number: pr.number }}>
                {(mutate) => (
                  <Button onClick={mutate}>
                    Squash and merge
                  </Button>
                )}
              </Mutation>
            </div>
          ));
        }}
      </Query>

      <hr />
    </React.Fragment>
  );
}

class Dashboard extends Component {
  render() {
    return (
      <div className="Dashboard">
        {repos.map((r) => (
          <OneRepo key={r} repo={r} />
        ))}
      </div>
    );
  }
}

export default Dashboard;
