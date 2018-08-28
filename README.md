# k8s-graphql-bindings

* have `kubectl` up and running in `/usr/local/bin/kubectl`
* set up: `npm i`
* [Create GitHub OAuth token](https://github.com/settings/tokens)
* add file `.env` to root and paste in `GITHUB_KEY=the_key_you_created`
* start kubectl server `npm run serve`
* start local fe client `npm start`

### Stack

* BE
  * `express`
  * `graphql-tools`
  * `k8s`
* FE
  * `create-react-app`
  * `apollo-boost`
