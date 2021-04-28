import { PullRequestEvent } from '@octokit/webhooks-types'
import { Endpoints, RequestParameters } from '@octokit/types'

export function buildApprovalRequest(event: PullRequestEvent): RequestParameters & Omit<Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"]["parameters"], "baseUrl" | "headers" | "mediaType"> {
  const actor = process.env.GITHUB_ACTOR
  return {
    owner: event.repository.owner.login,
    repo: event.repository.name,
    pull_number: event.number,
    event: 'APPROVE',
    body: (actor === 'dependabot[bot]') ? '@dependabot merge' : `Approved @${actor}`
  }
}
