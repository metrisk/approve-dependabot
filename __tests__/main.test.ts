import * as process from 'process'
import { run } from '../src/main'

describe('approve-dependabot', () => {
  let stdoutSpy: jest.SpyInstance<boolean, [str: string | Uint8Array, encoding?: BufferEncoding, cb?: (err?: Error) => void]>;
  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write')
  })
  afterEach(() => {
    stdoutSpy.mockReset()
  })
  describe('checks the actor is dependabot', () => {
    test('writes a warning when the actor is not Dependabot', async () => {
      process.env.GITHUB_ACTOR = "MFDOOM"
      run()
      expect(stdoutSpy).toHaveBeenCalledTimes(3)
      expect(stdoutSpy).toHaveBeenNthCalledWith(2, '::warning::Actor is not dependabot!\n')
    })
    test('does not write a warning when the actor is Dependabot', async () => {
      process.env.GITHUB_ACTOR = "dependabot[bot]"
      run()
      expect(stdoutSpy).not.toHaveBeenNthCalledWith(2, '::warning::Actor is not dependabot!\n')
    })
  })
})

