import { PullRequestEvent, WorkflowRunCompletedEvent } from '@octokit/webhooks-types'
import { Endpoints, RequestParameters } from '@octokit/types'

export function buildApprovalRequest(
  event: PullRequestEvent | WorkflowRunCompletedEvent
): RequestParameters &
  Omit<
    Endpoints['POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['parameters'],
    'baseUrl' | 'headers' | 'mediaType'
  > {
  let pull_number: number;
  if ((<PullRequestEvent>event).number) {
    pull_number = (<PullRequestEvent>event).number as number
  } else {
    pull_number = (<WorkflowRunCompletedEvent>event).workflow_run.pull_requests[0].number as number
  }

  return {
    owner: event.repository.owner.login,
    repo: event.repository.name,
    pull_number,
    event: 'APPROVE',
    body: 'Auto Approved :+1:'
  }
}
