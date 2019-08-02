const jestConfig = require('./.jest/jest.config')

module.exports = function stryker(config) {
  config.set({
    mutate: ['src/**/*.js?(x)', '!src/**/*@(.test|.spec|Spec).js?(x)'],
    mutator: 'javascript',
    testRunner: 'jest',
    reporters: ['progress', 'clear-text', 'html'],
    coverageAnalysis: 'off',
    jest: {
      projectType: 'custom',
      config: jestConfig,
      enableFindRelatedTests: true,
    },
  })
}
