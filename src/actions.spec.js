import factory from './actions'

const name = 'NAME'
const { reset, execute, resolve, reject } = factory(name)

const testProtocol = (creatorName, fn, { name: actionName, status }) => {
  describe(`actions.${creatorName}`, () => {
    const actual = fn()

    it('has type prefixed with @@redux-async/NAME', () => {
      const prefix = new RegExp(`^@@redux-async/${actionName}`)

      expect(actual.type).to.match(prefix)
    })

    it('has status and name under `meta`', () => {
      const { meta } = actual

      expect(meta.status).to.be.equal(status)
      expect(meta.name).to.be.equal(name)
    })
  })
}

testProtocol('reset', reset, { name, status: 'IDLE' })
testProtocol('execute', execute, { name, status: 'PENDING' })
testProtocol('resolve', resolve, { name, status: 'FULFILLED' })
testProtocol('reject', reject, { name, status: 'REJECTED' })

describe('actions.reset', () => {
  it('has neither error or payload', () => {
    const actual = reset()

    expect(actual).to.not.have.property('error')
    expect(actual).to.not.have.property('payload')
  })
})

describe('actions.execute', () => {
  it('has neither error nor payload', () => {
    const actual = execute()

    expect(actual).to.not.have.property('error')
    expect(actual).to.not.have.property('payload')
  })
})

describe('actions.resolve', () => {
  it('sends the payload as received', () => {
    const expected = { data: [1, 2, 3] }
    const { payload: actual } = resolve(expected)

    expect(actual).to.be.equal(expected)
  })

  it('has no error flag', () => {
    const actual = resolve('qwer')

    expect(actual).to.not.have.property('error')
  })
})

describe('actions.reject', () => {
  it('sends an error flag', () => {
    const { error } = reject('asdf')

    expect(error).to.be.true
  })

  it('sends the error under payload', () => {
    const error = Error('Something went wrong')
    const { payload } = reject(error)

    expect(payload).to.be.equal(error)
  })
})
