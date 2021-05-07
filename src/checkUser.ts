import * as core from '@actions/core'

export const checkUser = (): boolean => {
  const input = core.getInput('user', {
    required: false
  })
  const user = input?.length > 0 ? input : 'dependabot[bot]'
  const actor = process.env.GITHUB_ACTOR
  const result: boolean = actor === user
  return result
}
