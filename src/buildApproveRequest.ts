import { PullRequestEvent } from '@octokit/webhooks-types'
import { Endpoints, RequestParameters } from '@octokit/types'

export function buildApprovalRequest (
  event: PullRequestEvent
): RequestParameters &
  Omit<
  Endpoints['POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews']['parameters'],
  'baseUrl' | 'headers' | 'mediaType'
  > {
  return {
    owner: event.repository.owner.login,
    repo: event.repository.name,
    pull_number: event.number,
    event: 'APPROVE',
    body: 'Auto Approved :+1:'
  }
}
