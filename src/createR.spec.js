import createR from './createR'
import { STATUS, pending, fulfilled, rejected } from './actions'

describe('createR', () => {
  it('handles actions only for that name', () => {
    const reducer = createR('NAME')
    const state = {}

    const untouchedState = reducer(state, pending('ALIAS'))
    const newState = reducer(state, pending('NAME'))

    expect(untouchedState).to.be.equal(state)
    expect(newState).to.not.be.equal(state)
  })
})

describe('createR > reducer', () => {
  const name = 'NAME'
  const reducer = createR(name)

  describe('status tracking', () => {
    it('starts as IDLE given nothing was executed', () => {
      const state = reducer(undefined, {})

      expect(state.status).to.be.equal(STATUS.IDLE)
    })

    it('changes to PENDING when async action starts', () => {
      const state = reducer(undefined, pending(name))

      expect(state.status).to.be.equal(STATUS.PENDING)
    })

    it('changes to FULFILLED on success', () => {
      const state = reducer(undefined, fulfilled(name, {}))

      expect(state.status).to.be.equal(STATUS.FULFILLED)
    })

    it('changes to REJECTED on error', () => {
      const state = reducer(undefined, rejected(name, {}))

      expect(state.status).to.be.equal(STATUS.REJECTED)
    })
  })

  describe('loading tracking', () => {
    it('starts as false given nothing is happening', () => {
      const state = reducer(undefined, {})

      expect(state.loading).to.be.false
    })

    it('turns true on PENDING', () => {
      const state = reducer(undefined, pending(name))

      expect(state.loading).to.be.true
    })

    it('returns to false independently of the outcome', () => {
      const stateSuccessful = reducer({ loading: true }, fulfilled(name, {}))
      const stateUnsuccessful = reducer({ loading: true }, rejected(name, {}))

      expect(stateSuccessful.loading).to.be.false
      expect(stateUnsuccessful.loading).to.be.false
    })
  })

  describe('error tracking', () => {
    it('starts false once we don\'t know what\'ll happen', () => {
      const state = reducer(undefined, {})

      expect(state.error).to.be.false
    })

    // If we start the async again we should reset what've happened before
    it('turns false on PENDING', () => {
      const state = reducer({ error: true }, pending(name))

      expect(state.error).to.be.false
    })

    // In theory this scenario should be invalid once PENDING turns it into false,
    // and every async action should be PENDING first. However, better safe than sorry
    it('turns false on FULFILLED', () => {
      const state = reducer({ error: true }, fulfilled(name, {}))

      expect(state.error).to.be.false
    })

    it('turns true on REJECTED', () => {
      const state = reducer({ error: false }, rejected(name, {}))

      expect(state.error).to.be.true
    })
  })

  describe('data handling', () => {
    it('starts as null', () => {
      const state = reducer(undefined, {})

      expect(state.data).to.be.null
    })

    it('turns null on PENDING', () => {
      const state = reducer({ data: 'Something' }, pending(name))

      expect(state.data).to.be.null
    })

    it('becomes payload on FULFILLED', () => {
      const payload = 'Something'
      const state = reducer({ data: 'asdf' }, fulfilled(name, payload))

      expect(state.data).to.be.equal(payload)
    })

    it('becomes payload on REJECTED', () => {
      const error = new Error('Something went wrong')
      const state = reducer({ data: 'qwer' }, rejected(name, error))

      expect(state.data).to.be.equal(error)
    })
  })
})