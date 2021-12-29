# GitHub Merged Pull Requests

Showcase your merged pull requests on GitHub.

## Action Inputs

### `token` (*required*)

Personal access token with `read:user` scope.

* Generate a token at: https://github.com/settings/tokens
* Add the token to the repo where you use this action: https://github.com/USER/REPO/settings/secrets/actions

### `output`

Path to generated file.

## Example

Check out the [example table](./examples/MERGED_PULL_REQUESTS.md) to see what the output of this action looks like. I use this action for [my profile README](https://github.com/yaph/yaph), where you find [a workflow definition](https://github.com/yaph/yaph/blob/main/.github/workflows/merged-pull-requests.yml) that shows how to use this action in your own repository.