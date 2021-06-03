import { validateAction } from '../src/validateAction'
import * as Check from '../src/checkUser'
import { PullRequestEvent, WorkflowRunCompletedEvent } from '@octokit/webhooks-types'
import path from 'path'

describe('validateAction', (): void => {
  let mockCheckUser = jest.spyOn(Check, 'checkUser')
  let mockStdOut: jest.SpyInstance<
    boolean,
    [
      str: string | Uint8Array,
      encoding?: BufferEncoding,
      cb?: (err?: Error) => void
    ]
  >
  let result: boolean | PullRequestEvent | WorkflowRunCompletedEvent
  const oldPE = process.env
  beforeEach(() => {
    mockStdOut = jest.spyOn(process.stdout, 'write')
    process.env = { ...oldPE }
  })
  afterEach(() => {
    process.env = oldPE
    mockStdOut.mockReset()
    process.exitCode = undefined
  })
  describe('wrong user', () => {
    beforeEach(() => {
      result = validateAction()
      mockCheckUser.mockImplementationOnce(() => false)
    })
    afterEach(() => {
      mockCheckUser.mockReset()
    })
    test('does not set the exitCode', () => {
      expect(process.exitCode).toBeUndefined()
    })
    test('writes a warning message', () => {
      expect(mockStdOut).toHaveBeenCalledTimes(1)
      expect(mockStdOut).toHaveBeenCalledWith('::warning::Not the right user\n')
    })
    test('returns false', () => {
      expect(result).toStrictEqual(false)
    })
  })
  describe('no github token', () => {
    beforeEach(() => {
      mockCheckUser.mockImplementationOnce(() => true)
      process.env.GITHUB_TOKEN = undefined
      result = validateAction()
    })
    afterEach(() => {
      mockCheckUser.mockReset()
    })
    test('sets exitCode to 1 when no token is present', () => {
      expect(process.exitCode).toBe(1)
    })
    test('writes to stdout with an error message', () => {
      expect(mockStdOut).toHaveBeenCalledTimes(1)
      expect(mockStdOut).toHaveBeenCalledWith(
        '::error::GITHUB_TOKEN environment variable not set\n'
      )
    })
    test('returns false', () => {
      expect(result).toStrictEqual(false)
    })
  })
  describe('event is not a PR', () => {
    beforeEach(() => {
      mockCheckUser.mockImplementation(() => true)
      process.env.GITHUB_TOKEN = '123'
      process.env.GITHUB_EVENT_PATH = path.join(__dirname, './not_pr.json')
      result = validateAction()
    })
    afterEach(() => {
      mockCheckUser.mockReset()
    })
    test('sets exitCode to 1 when no token is present', () => {
      expect(process.exitCode).toBe(1)
    })
    test('writes to stdout with an error message', () => {
      expect(mockStdOut).toHaveBeenCalledTimes(1)
      expect(mockStdOut).toHaveBeenCalledWith(
        '::error::Not the correct event type\n'
      )
    })
    test('returns false', () => {
      expect(result).toStrictEqual(false)
    })
  })
  describe('returns event when everything is correct', () => {
    beforeEach(() => {
      mockCheckUser.mockImplementation(() => true)
      process.env.GITHUB_TOKEN = '123'
      process.env.GITHUB_EVENT_PATH = path.join(__dirname, './pr.json')
      result = validateAction()
    })
    afterEach(() => {
      mockCheckUser.mockReset()
    })
    test('exitCode is undefined', () => {
      expect(process.exitCode).toBeUndefined()
    })
    test('does not write to stdout', () => {
      expect(mockStdOut).toHaveBeenCalledTimes(0)
    })
    test('returns the event', () => {
      const event = require('./pr.json')
      console.log(result)
      expect(result).toStrictEqual(event)
    })
  })
})
