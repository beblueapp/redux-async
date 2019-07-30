import createR from './createR'
import { STATUS, createAT, pending, fulfilled, rejected, idle } from './actions'

describe('createR', () => {
  const name = 'NAME'
  const reducer = createR(name)

  it('handles actions only for that name', () => {
    const state = {}

    const untouchedState = reducer(state, pending('ALIAS'))
    const newState = reducer(state, pending(name))

    expect(untouchedState).to.be.equal(state)
    expect(newState).to.not.be.equal(state)
  })

  it('starts as IDLE and not loading', () => {
    const state = reducer(undefined, {})

    expect(state.status).to.be.equal(STATUS.IDLE)
    expect(state.loading).to.be.false
  })

  it('has no data or error by default', () => {
    const state = reducer(undefined, {})

    expect(state.data).to.be.null
    expect(state.error).to.be.null
  })

  it('returns to initial state on IDLE', () => {
    const initialState = { status: STATUS.IDLE, loading: false, error: null, data: null }
    const state = { error: true, data: [], loading: true, status: STATUS.REJECTED }
    const newState = reducer(state, idle(name))

    expect(newState).to.be.like(initialState)
  })

  it('returns current state on unknown actions', () => {
    const state = { loading: false, error: 'asdf', data: [], status: STATUS.REJECTED }
    const newState = reducer(state, { type: 'UNKNOWN', meta: { name } })

    expect(newState).to.be.equal(state)
  })

  it('returns current state on unknown statuses', () => {
    const state = { loading: false, error: 'asdf', data: [], status: STATUS.REJECTED }
    const newState = reducer(state, { type: createAT(name, 'SOMETHING'), meta: { name, status: 'SOMETHING' } })

    expect(newState).to.be.equal(state)
  })

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
    it('starts null once we don\'t know what\'ll happen', () => {
      const state = reducer(undefined, {})

      expect(state.error).to.be.null
    })

    // If we start the async again we should reset what've happened before
    it('turns null on PENDING', () => {
      const state = reducer({ error: true }, pending(name))

      expect(state.error).to.be.null
    })

    // In theory this scenario should be invalid once PENDING turns it into false,
    // and every async action should be PENDING first. However, better safe than sorry
    it('turns null on FULFILLED', () => {
      const state = reducer({ error: true }, fulfilled(name, {}))

      expect(state.error).to.be.null
    })

    it('becomes payload on REJECTED', () => {
      const error = new Error('Something went wrong')
      const state = reducer({ data: 'qwer' }, rejected(name, error))

      expect(state.error).to.be.equal(error)
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

    it('turns null on REJECTED', () => {
      const error = new Error('Something went wrong')
      const state = reducer({ data: 'qwer' }, rejected(name, error))

      expect(state.data).to.be.null
    })
  })
})

describe('createR > reducer', () => {
  const name = 'NAME'
  const create = r => createR(name, r)

  it('is not called on idle', () => {
    const inner = sinon.fake()
    const reducer = create(inner)

    reducer({}, idle(name))

    expect(inner.callCount).to.be.equal(0)
  })

  it('is called on pending, fulfilled and rejected', () => {
    const inner = sinon.fake()
    const reducer = create(inner)

    reducer({}, pending(name))
    reducer({}, fulfilled(name, null))
    reducer({}, rejected(name, null))

    expect(inner.callCount).to.be.equal(3)
  })

  it('is not called on unknown actions', () => {
    const inner = sinon.fake()
    const reducer = create(inner)

    reducer({}, { type: createAT(name, 'SOMETHING'), meta: { status: 'SOMETHING' } })

    expect(inner.callCount).to.be.equal(0)
  })

  it('is called with current state without status and loading', () => {
    const inner = sinon.fake()
    const reducer = create(inner)
    const state = { status: STATUS.PENDING, loading: true, error: 'asdf', data: [] }

    reducer(state, fulfilled(name, 'qwer'))

    expect(inner.firstCall.args[0]).to.be.like({ error: 'asdf', data: [] })
  })

  it('receives an action with status as type', () => {
    const inner = sinon.fake()
    const reducer = create(inner)

    reducer({}, rejected(name, 'asdf'))

    expect(inner.firstCall.args[1]).to.have.property('type', STATUS.REJECTED)
  })

  it('receives payload as it comes on main reducer', () => {
    const inner = sinon.fake()
    const reducer = create(inner)

    reducer({}, rejected(name, 'asdf'))
    reducer({}, fulfilled(name, 'qwer'))

    expect(inner.firstCall.args[1]).to.be.like({ error: true, payload: 'asdf' })
    expect(inner.secondCall.args[1]).to.be.like({ payload: 'qwer' })
  })
})
