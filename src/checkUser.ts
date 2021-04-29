import * as core from '@actions/core'

export const checkUser = () => {
  const user = 'dependabot[bot]'
  const actor = process.env.GITHUB_ACTOR
  core.info(`USER ${user} / ACTOR ${actor}`)
  const result: boolean = (actor === user)
  return result
}
