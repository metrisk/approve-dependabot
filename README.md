# Approve PR Action

This action will auto approve a pull request based upon the actor/submitter of the PR.

The default settings are for Dependabot PRs because no one wants to go through hundreds of PRs for NPM package updates, approving them and then merging them.

## Example usage with defaults

```yaml
on: pull_request
name: Merge PR
jobs:
  mergePR:
    name: PR merger
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
      - name: Merge PR
        if: ${{ github.actor == 'dependabot[bot]' }}
        uses: metrisk/approve-dependabot@main
```

## F.A.Q

<details>
  <summary>Why should I put the 'if' check in the workflow if the action does that for me?</summary>
  The user/actor check in the action is purely a safety mechanism in case you forget to put it in your workflow. In the workflow it prevents the action from running, which in turn means you use less action minutes, which also could save you some (albeit small) money in the long run.
</details>
