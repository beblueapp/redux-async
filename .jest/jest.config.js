const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '..'),
  coverageDirectory: 'coverage',
  testMatch: [
    '**/src/**/*.spec.js'
  ],
  setupTestFrameworkScriptFile: path.resolve(__dirname, 'utilities.setup.js')
}
