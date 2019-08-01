const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  coverageDirectory: 'coverage',
  testMatch: [
    '**/src/**/*.spec.js',
  ],
  setupFilesAfterEnv: [path.resolve(__dirname, 'utilities.setup.js')],
}
