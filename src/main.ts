import * as core from '@actions/core'
import * as github from '@actions/github'

export async function run(): Promise<void> {
  try {
    core.startGroup('Checking actor is Dependabot')
    if (process.env.GITHUB_ACTOR !== 'dependabot[bot]') {
      core.warning('Actor is not dependabot!')
      core.endGroup()
      return
    }
    core.endGroup()
    if (!process.env.GITHUB_TOKEN) {
      core.setFailed('GITHUB_TOKEN environment variable not set')
    }
    const token = process.env.GITHUB_TOKEN as string;
    const octo = github.getOctokit(token);
    const event = require(`${process.env.GITHUB_EVENT_PATH}`)
    if (!Object.keys(event).includes('pull_request')) {
      core.setFailed('Not a Pull Request event')
    }
    const pull_number: number = event.number
    const owner = event.repository.owner.login
    const repo = event.repository.name
    await core.group('Approving PR', async () => {
      await octo.pulls.createReview({
        owner,
        repo,
        pull_number,
        event: 'APPROVE',
        body: '@dependabot merge'
      })
    })

    core.info('Approved')
    return;

  } catch (error) {
    core.setFailed(error)
  }
}

run()
