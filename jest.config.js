module.exports = {
  verbose: true,
  watchman: false, // peut être mis à true, corrigé avec watchman 4.9.0
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.js',
    '!**/node_modules/**',
  ],
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: [ "**/tests/**/*.js", "**/?(*.)+(spec|test).js" ],
};
