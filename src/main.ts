import * as core from '@actions/core'
import * as github from '@actions/github'
import { buildApprovalRequest } from './buildApproveRequest'
import { validateAction } from './validateAction'


export async function run(): Promise<void> {
  try {
    const event = validateAction()
    if (!event) return
    const token = process.env.GITHUB_TOKEN as string;
    const octo = github.getOctokit(token);

    const approved = await core.group('Approving PR', async () => {
      const approveRequest = buildApprovalRequest(event)
      return await octo.pulls.createReview(approveRequest)
    })
    if (approved.status === 200) {
      core.info('Approved')
      return;
    } else {
      core.error(JSON.stringify(approved))
      core.setFailed('Failed to approve the PR')
      return
    }
  } catch (error) {
    core.setFailed(error)
  }
}

run()
