/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  moduleNameMapper: {
    '^config$': '<rootDir>/test/mocks/config.js',
  },
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  clearMocks: true,
  testTimeout: 10000,
};
