import factory from './actions'

const name = 'NAME'
const { reset, pending, fulfilled, rejected } = factory(name)

const testProtocol = (creatorName, fn, { name: actionName, status }) => {
  describe(`actions.${creatorName}`, () => {
    const actual = fn()

    it('has type prefixed with @@redux-async/NAME', () => {
      const prefix = new RegExp(`^@@redux-async/${actionName}`)

      expect(actual.type).to.match(prefix)
    })

    it('has status under `meta`', () => {
      const { meta } = actual

      expect(meta.status).to.be.equal(status)
    })

    it('has the original name under `meta`', () => {
      const { meta } = actual

      expect(meta.name).to.be.equal(name)
    })
  })
}


testProtocol('reset', reset, { name, status: 'IDLE' })
testProtocol('pending', pending, { name, status: 'PENDING' })
testProtocol('fulfilled', fulfilled, { name, status: 'FULFILLED' })
testProtocol('rejected', rejected, { name, status: 'REJECTED' })

describe('actions.reset', () => {
  it('has neither error or payload', () => {
    const actual = reset()

    expect(actual).to.not.have.property('error')
    expect(actual).to.not.have.property('payload')
  })
})

describe('actions.pending', () => {
  it('has neither error nor payload', () => {
    const actual = pending()

    expect(actual).to.not.have.property('error')
    expect(actual).to.not.have.property('payload')
  })
})

describe('actions.fulfilled', () => {
  it('sends the payload as received', () => {
    const expected = { data: [1, 2, 3] }
    const { payload: actual } = fulfilled(expected)

    expect(actual).to.be.equal(expected)
  })

  it('has no error flag', () => {
    const actual = fulfilled('qwer')

    expect(actual).to.not.have.property('error')
  })
})

describe('actions.rejected', () => {
  it('sends an error flag', () => {
    const { error } = rejected('asdf')

    expect(error).to.be.true
  })

  it('sends the error under payload', () => {
    const error = Error('Something went wrong')
    const { payload } = rejected(error)

    expect(payload).to.be.equal(error)
  })
})
