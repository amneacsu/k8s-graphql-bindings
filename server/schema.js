const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
  type Deployment {
    image: String
    data: String @deprecated(reason: "Was debug hatch.")
  }

  type PullRequest {
    id: String!
    number: Int!
    headRefName: String!
    baseRefName: String!
    title: String!
    body: String
    issueId: String
    progress: Float
    html_url: String
  }

  type Query {
    deployment(name: String!): Deployment
    deployments: [Deployment]
    pullRequest(repo: String!, number: Int!): PullRequest
    pullRequests(repo: String!): [PullRequest]
  }

  type Mutation {
    merge(repo: String!, number: Int!): PullRequest
  }
`;

const getPullRequest = (github, args) => {
  const [owner, repo] = args.repo.split('/');

  return github.get(`/repos/${owner}/${repo}/pulls/${args.number}`).then((response) => {
    return response.data;
  });
};

const resolvers = {
  Query: {
    deployment: (_, args, { kubectl }) => {
      return kubectl.deployment.get(args.name).then((response) => {
        return response;
      });
    },
    deployments: (_, args, { kubectl }) => {
      return kubectl.deployment.list().then((resp) => {
        return resp.items;
      }, (err) => {
        console.log(err);
      });
    },
    pullRequests: (_, args, { github }) => {
      const [owner, repo] = args.repo.split('/');

      return github.get(`/repos/${owner}/${repo}/pulls?per_page=100`).then((response) => {
        return response.data;
      });
    },
    pullRequest: (_, args, { github }) => getPullRequest(github, args),
  },

  Mutation: {
    merge: (_, args, { github }) => {
      const [owner, repo] = args.repo.split('/');

      return github.put(`/repos/${owner}/${repo}/pulls/${args.number}/merge`, {
        merge_method: 'squash', // ????
      }).then((response) => {
        return getPullRequest(github, args);
      });
    },
  },

  Deployment: {
    image: (_) => {
      return _.spec.template.spec.containers[0].image;
    },
  },
  PullRequest: {
    // title: ,
    issueId: (_) => {
      const match = _.title.match(/(ZP|CD|DD|SA)[-\s]?(\d+)/);
      if (!match) return null;
      const [full, acc, number] = match;
      return `${acc}-${number}`;
    },
    progress: (_) => {
      const todos = _.body.match(/\[ \]/g);
      const dones = _.body.match(/\[x\]/g);

      if (!todos && !dones) {
        return null;
      }

      const todoCount = todos ? todos.length : 0;
      const doneCount = dones ? dones.length : 0;

      return doneCount * ((todoCount + doneCount) / 100)
    },
    baseRefName: (_) => {
      return _.base.ref;
    },
    headRefName: (_) => {
      return _.head.ref;
    },
  },
};

module.exports = makeExecutableSchema({
  typeDefs,
  resolvers,
});
