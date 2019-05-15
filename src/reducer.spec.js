import createR from './reducer'
import { STATUS } from './types'

const actionCreator = (st, payload, error) => ({
  type: `NAME_${st}`, payload, error, meta: { name: 'NAME', status: st }
})

describe('createR', () => {
  it('handles actions only for that name', () => {
    const reducer = createR('NAME')
    const state = {}

    const untouchedState = reducer(state, { type: 'ALIAS_PENDING' })
    const newState = reducer(state, { type: 'NAME_PENDING', meta: { name: 'NAME', status: STATUS.PENDING } })

    expect(untouchedState).to.be.equal(state)
    expect(newState).to.not.be.equal(state)
  })
})

describe('createR > reducer', () => {
  const reducer = createR('NAME')

  describe('status tracking', () => {
    it('starts as IDLE given nothing was executed', () => {
      const state = reducer(undefined, {})

      expect(state.status).to.be.equal(STATUS.IDLE)
    })

    it('changes to PENDING when async action starts', () => {
      const state = reducer(undefined, actionCreator(STATUS.PENDING))

      expect(state.status).to.be.equal(STATUS.PENDING)
    })

    it('changes to FULFILLED on success', () => {
      const state = reducer(undefined, actionCreator(STATUS.FULFILLED))

      expect(state.status).to.be.equal(STATUS.FULFILLED)
    })

    it('changes to REJECTED on error', () => {
      const state = reducer(undefined, actionCreator(STATUS.REJECTED))

      expect(state.status).to.be.equal(STATUS.REJECTED)
    })
  })

  describe('loading tracking', () => {
    it('starts as false given nothing is happening', () => {
      const state = reducer(undefined, {})

      expect(state.loading).to.be.false
    })

    it('turns true on PENDING', () => {
      const state = reducer(undefined, actionCreator(STATUS.PENDING))

      expect(state.loading).to.be.true
    })

    it('returns to false independently of the outcome', () => {
      const stateSuccessful = reducer({ loading: true }, actionCreator(STATUS.FULFILLED))
      const stateUnsuccessful = reducer({ loading: true }, actionCreator(STATUS.REJECTED))

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
      const state = reducer({ error: true }, actionCreator(STATUS.PENDING))

      expect(state.error).to.be.false
    })

    // In theory this scenario should be invalid once PENDING turns it into false,
    // and every async action should be PENDING first. However, better safe than sorry
    it('turns false on FULFILLED', () => {
      const state = reducer({ error: true }, actionCreator(STATUS.FULFILLED))

      expect(state.error).to.be.false
    })

    it('turns true on REJECTED', () => {
      const state = reducer({ error: false }, actionCreator(STATUS.REJECTED))

      expect(state.error).to.be.true
    })
  })

  describe('data handling', () => {
    it('starts as null', () => {
      const state = reducer(undefined, {})

      expect(state.data).to.be.null
    })

    it('turns null on PENDING', () => {
      const state = reducer({ data: 'Something' }, actionCreator(STATUS.PENDING))

      expect(state.data).to.be.null
    })

    it('becomes payload on FULFILLED', () => {
      const payload = 'Something'
      const state = reducer({ data: 'asdf' }, actionCreator(STATUS.FULFILLED, payload))

      expect(state.data).to.be.equal(payload)
    })

    it('becomes payload on REJECTED', () => {
      const error = new Error('Something went wrong')
      const state = reducer({ data: 'qwer' }, actionCreator(STATUS.REJECTED, error, true))

      expect(state.data).to.be.equal(error)
    })
  })
})
