import { Endpoints, RequestParameters } from '@octokit/types';
import { buildApprovalRequest } from '../src/buildApproveRequest'
const event = require('./pr.json')
describe('buildApprovalRequest', () => {
  let result: RequestParameters & Omit<Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"]["parameters"], "baseUrl" | "headers" | "mediaType">

  let expected: RequestParameters & Omit<Endpoints["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"]["parameters"], "baseUrl" | "headers" | "mediaType">
  const oldPE = process.env
  describe('when actor is not dependabot', () => {
    beforeEach(() => {
      process.env = { ...oldPE }
      process.env.GITHUB_ACTOR = 'MF_GRIMM'
      expected = {
        "body": "Auto Approved :+1:",
        "event": "APPROVE",
        "owner": "MF_GRIMM",
        "pull_number": 1,
        "repo": "TEST"
      }
      result = buildApprovalRequest(event)
    })
    afterEach(() => {
      process.env = oldPE
    })
    test('returns expected body', () => {
      expect(result.body).toStrictEqual(expected.body)
    })

    test('returns expected event', () => {
      expect(result.event).toStrictEqual(expected.event)
    })

    test('returns expected owner', () => {
      expect(result.owner).toStrictEqual(expected.owner)
    })

    test('returns expected pull_number', () => {
      expect(result.pull_number).toStrictEqual(expected.pull_number)
    })
    test('returns expected repo', () => {
      expect(result.repo).toStrictEqual(expected.repo)
    })
  })
  describe('when actor is dependabot', () => {
    beforeEach(() => {
      process.env = { ...oldPE }
      process.env.GITHUB_ACTOR = 'dependabot[bot]'
      expected = {
        "body": "Auto Approved :+1:",
        "event": "APPROVE",
        "owner": "MF_GRIMM",
        "pull_number": 1,
        "repo": "TEST"
      }
      result = buildApprovalRequest(event)
    })
    afterEach(() => {
      process.env = oldPE
    })
    test('returns expected body', () => {
      expect(result.body).toStrictEqual(expected.body)
    })

    test('returns expected event', () => {
      expect(result.event).toStrictEqual(expected.event)
    })

    test('returns expected owner', () => {
      expect(result.owner).toStrictEqual(expected.owner)
    })

    test('returns expected pull_number', () => {
      expect(result.pull_number).toStrictEqual(expected.pull_number)
    })
    test('returns expected repo', () => {
      expect(result.repo).toStrictEqual(expected.repo)
    })
  })
})
