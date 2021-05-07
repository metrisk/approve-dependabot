# Approve PR Action

This action will auto approve a pull request based upon the actor/submitter of the PR.

The default settings are for Dependabot PRs because no one wants to go through hundreds of PRs for NPM package updates, approving them.

## Example usage with defaults

```yaml
on: pull_request_target
name: Approve PR
jobs:
  approvePR:
    name: PR approver
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: npm cache
        id: npm-cache
        uses: actions/cache@v2.1.5
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles(**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-
      - uses: actions/setup-node@v2
      - name: Install Deps if no cache
        if: steps.npm-cache.outputs.cache-hit != true
        run: npm ci
      - name: Execute the tests
        run: npm run test
      - name: Approving PR
        if: ${{ github.actor == 'dependabot[bot]' }}
        uses: metrisk/approve-dependabot@main
```

## F.A.Q

<details>
  <summary>
    This doesn't work on pull_request events!
  </summary>
  This is due to changes that Github made regarding permissions for the Actions Github Token when dealing with Dependabot pull requests (full details can be found https://github.blog/changelog/2021-02-19-github-actions-workflows-triggered-by-dependabot-prs-will-run-with-read-only-permissions/).<br /><br />

  There are ways around this, the example in this Readme provides one example and the other method can be found in this workflow file './.github/workflows/pull_request_approve_dependabot.yml' in the repository. More details here - https://github.com/dependabot/dependabot-core/issues/3253#issuecomment-797125425
</details>

<details>
  <summary>Why should I put the 'if' check in the workflow if the action does that for me?</summary>
  The user/actor check in the action is purely a safety mechanism in case you forget to put it in your workflow. In the workflow it prevents the action from running, which in turn means you use less action minutes, which also could save you some (albeit small) money in the long run.
</details>

