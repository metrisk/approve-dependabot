module.exports = {
  roots: ['<rootDir>/tests', '<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': '@swc-node/jest'
  }
}
