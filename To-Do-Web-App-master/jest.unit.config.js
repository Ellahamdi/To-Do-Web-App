module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  reporters: [
    'default',
    [ 'jest-junit', { outputDirectory: 'reports/junit', outputName: 'jest-junit.xml' } ]
  ],
  testMatch: ['**/__tests__/**/*.(test|spec).js', '**/?(*.)+(spec|test).js']
};
