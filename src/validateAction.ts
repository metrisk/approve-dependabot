import * as core from '@actions/core'
import { WebhookEvent, PullRequestEvent } from '@octokit/webhooks-types'
import { checkUser } from './checkUser'

export function validateAction(): false | PullRequestEvent {
  if (!checkUser()) {
    core.warning('Not the right user')
    return false
  }
  if (typeof process.env.GITHUB_TOKEN !== 'string') {
    core.setFailed('GITHUB_TOKEN environment variable not set')
    return false
  }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const event: WebhookEvent = require(`${process.env.GITHUB_EVENT_PATH as string}`)

  if (!Object.keys(event).includes('pull_request')) {
    core.setFailed('Not a Pull Request event')
    return false
  }
  return event as PullRequestEvent
}
