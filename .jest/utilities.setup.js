const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const chaiLike = require('chai-like')
const sinon = require('sinon')

chai.use(chaiAsPromised)
chai.use(chaiLike)

global.jestExpect = global.expect
global.expect = chai.expect
global.sinon = sinon
