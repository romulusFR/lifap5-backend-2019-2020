// SEE
// https://jestjs.io/docs/en/getting-started
// https://jestjs.io/docs/en/testing-frameworks
// https://github.com/visionmedia/supertest
// https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

module.exports = {
  verbose: true,
  watchman: false, // peut être mis à true, corrigé avec watchman 4.9.0
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
    '!src/server.js',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: [ "**/tests/**/*.js", "**/?(*.)+(spec|test).js" ],
};
