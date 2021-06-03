import * as core from '@actions/core'
import { WebhookEvent, PullRequestEvent, WorkflowRunCompletedEvent } from '@octokit/webhooks-types'
import { checkUser } from './checkUser'

export function validateAction(): false | PullRequestEvent | WorkflowRunCompletedEvent {
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

  if ((<PullRequestEvent>event).number === undefined && (<WorkflowRunCompletedEvent>event).workflow === undefined) {
    core.setFailed('Not the correct event type')
    return false
  }
  return event as PullRequestEvent | WorkflowRunCompletedEvent
}
