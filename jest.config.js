module.exports = {
  verbose: true,
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: [
    "/src/**/*.js",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ]
};

