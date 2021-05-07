import {checkUser} from '../src/checkUser'
import * as core from '@actions/core'

const expectedResults = [
  {
    user: 'Dependabot - Default value for user',
    results: [
      {
        actor: 'dependabot[bot]',
        inputUser: undefined,
        result: true
      },
      {
        actor: 'dependabot[bot]',
        inputUser: 'MFDOOM',
        result: false
      },
      {
        actor: 'dependabot[bot]',
        inputUser: 'dependabot[bot]',
        result: true
      },
      {
        actor: 'KING_GEEDORAH',
        inputUser: undefined,
        result: false
      },
      {
        actor: 'VIKTOR_VAUGHAN',
        inputUser: 'dependabot[bot]',
        result: false
      }
    ]
  },
  {
    user: 'ZEV_LOVE_X - Input user',
    results: [
      {
        actor: 'ZEV_LOVE_X',
        inputUser: 'ZEV_LOVE_X',
        result: true
      },
      {
        actor: 'dependabot[bot]',
        inputUser: 'ZEV_LOVE_X',
        result: false
      },
      {
        actor: 'ZEV_LOVE_X',
        inputUser: undefined,
        result: false
      },
      {
        actor: 'SUBROC',
        inputUser: 'ZEV_LOVE_X',
        result: false
      },
      {
        actor: 'ZEV_LOVE_X',
        inputUser: 'dependabot[bot]',
        result: false
      }
    ]
  }
]

describe('checkUser', () => {
  let mockCore: jest.SpyInstance<
    string,
    [name: string, options?: core.InputOptions]
  >
  const oldPE = process.env
  let mockPE: unknown
  beforeEach(() => {
    mockCore = jest.spyOn(core, 'getInput')
    process.env = {...oldPE}
  })
  afterEach(() => {
    mockCore.mockRestore()
    process.env = oldPE
  })
  expectedResults.forEach(users => {
    describe(users.user, () => {
      users.results.forEach(result => {
        test(`when actor: ${result.actor} and inputUser: ${result.inputUser} then result: ${result.result}`, () => {
          process.env.GITHUB_ACTOR = result.actor
          mockCore.mockReturnValue(result.inputUser as string)
          expect(checkUser()).toStrictEqual(result.result)
        })
      })
    })
  })
})
