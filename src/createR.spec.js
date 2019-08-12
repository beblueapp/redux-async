import createR from './createR'
import createA, { STATUS } from './actions'

describe('createR', () => {
  const name = 'NAME'
  const reducer = createR(name)
  const { reset, execute, resolve, reject } = createA(name)

  it('handles actions only for that name', () => {
    const { execute: foreign } = createA('ALIAS')
    const state = {}

    const untouchedState = reducer(state, foreign())
    const newState = reducer(state, execute())

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
    const newState = reducer(state, reset())

    expect(newState).to.be.like(initialState)
  })

  it('returns current state on unknown actions', () => {
    const state = { loading: false, error: 'asdf', data: [], status: STATUS.REJECTED }

    const newState = reducer(state, { type: 'UNKNOWN', meta: { name } })

    expect(newState).to.be.equal(state)
  })

  it('returns current state when names doesn\'t match', () => {
    const state = { loading: false, error: 'asdf', data: [], status: STATUS.REJECTED }
    const originalAction = execute()
    const action = { ...originalAction, meta: { ...originalAction.meta, name: 'ASDF' } }

    const newState = reducer(state, action)

    expect(newState).to.be.equal(state)
  })

  it('keeps current status and loading on unknown statuses', () => {
    const state = { loading: true, status: STATUS.PENDING, data: null, error: null }
    const originalAction = execute()
    const action = { ...originalAction, meta: { ...originalAction.meta, status: 'SOMETHING' } }

    const newState = reducer(state, action)

    expect(newState.loading).to.be.true
    expect(newState.status).to.be.equal(STATUS.PENDING)
  })

  it('keeps current data and error on unknown statuses', () => {
    const state = { loading: true, status: STATUS.PENDING, data: 'data', error: 'error' }
    const originalAction = execute()
    const action = { ...originalAction, meta: { ...originalAction.meta, status: 'SOMETHING' } }

    const newState = reducer(state, action)

    expect(newState.data).to.be.equal('data')
    expect(newState.error).to.be.equal('error')
  })

  describe('status tracking', () => {
    it('starts as IDLE given nothing was executed', () => {
      const state = reducer(undefined, {})

      expect(state.status).to.be.equal(STATUS.IDLE)
    })

    it('changes to PENDING when async action starts', () => {
      const state = reducer(undefined, execute())

      expect(state.status).to.be.equal(STATUS.PENDING)
    })

    it('changes to FULFILLED on success', () => {
      const state = reducer(undefined, resolve({}))

      expect(state.status).to.be.equal(STATUS.FULFILLED)
    })

    it('changes to REJECTED on error', () => {
      const state = reducer(undefined, reject({}))

      expect(state.status).to.be.equal(STATUS.REJECTED)
    })
  })

  describe('loading tracking', () => {
    it('starts as false given nothing is happening', () => {
      const state = reducer(undefined, {})

      expect(state.loading).to.be.false
    })

    it('turns true on PENDING', () => {
      const state = reducer(undefined, execute())

      expect(state.loading).to.be.true
    })

    it('returns to false independently of the outcome', () => {
      const stateSuccessful = reducer({ loading: true }, resolve({}))
      const stateUnsuccessful = reducer({ loading: true }, reject({}))

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
      const state = reducer({ error: true }, execute())

      expect(state.error).to.be.null
    })

    // In theory this scenario should be invalid once PENDING turns it into false,
    // and every async action should be PENDING first. However, better safe than sorry
    it('turns null on FULFILLED', () => {
      const state = reducer({ error: true }, resolve({}))

      expect(state.error).to.be.null
    })

    it('becomes payload on REJECTED', () => {
      const error = new Error('Something went wrong')
      const state = reducer({ data: 'qwer' }, reject(error))

      expect(state.error).to.be.equal(error)
    })
  })

  describe('data handling', () => {
    it('starts as null', () => {
      const state = reducer(undefined, {})

      expect(state.data).to.be.null
    })

    it('turns null on PENDING', () => {
      const state = reducer({ data: 'Something' }, execute())

      expect(state.data).to.be.null
    })

    it('becomes payload on FULFILLED', () => {
      const payload = 'Something'
      const state = reducer({ data: 'asdf' }, resolve(payload))

      expect(state.data).to.be.equal(payload)
    })

    it('turns null on REJECTED', () => {
      const error = new Error('Something went wrong')
      const state = reducer({ data: 'qwer' }, reject(error))

      expect(state.data).to.be.null
    })
  })
})

describe('createR > reducer', () => {
  const name = 'NAME'
  const create = r => createR(name, r)
  const { reset, execute, resolve, reject } = createA(name)

  it('is called on every action except reset', () => {
    const inner = sinon.fake.returns({})
    const reducer = create(inner)

    reducer({}, execute())
    reducer({}, resolve(null))
    reducer({}, reject(null))

    expect(inner.callCount).to.be.equal(3)

    reducer({}, reset())

    expect(inner.callCount).to.be.equal(3)
  })

  it('is not called on unknown actions', () => {
    const inner = sinon.fake.returns({})
    const reducer = create(inner)

    reducer({}, { type: 'SOMETHING', payload: 'asdf' })

    expect(inner.callCount).to.be.equal(0)
  })

  it('is called with current state without status and loading', () => {
    const inner = sinon.fake.returns({})
    const reducer = create(inner)
    const state = { status: STATUS.PENDING, loading: true, error: 'asdf', data: [] }

    reducer(state, resolve('qwer'))

    expect(inner.firstCall.args[0]).to.be.like({ error: 'asdf', data: [] })
  })

  it('receives an action with status as type', () => {
    const inner = sinon.fake.returns({})
    const reducer = create(inner)

    reducer({}, reject('asdf'))

    expect(inner.firstCall.args[1]).to.have.property('type', STATUS.REJECTED)
  })

  it('receives payload as it comes on main reducer', () => {
    const inner = sinon.fake.returns({})
    const reducer = create(inner)

    reducer({}, reject('asdf'))
    reducer({}, resolve('qwer'))

    expect(inner.firstCall.args[1]).to.be.like({ error: true, payload: 'asdf' })
    expect(inner.secondCall.args[1]).to.be.like({ payload: 'qwer' })
  })

  it('should return error and data to be used as next state', () => {
    const inner = () => ({ error: 'asdf', data: [1], misc: 'asdf' })
    const reducer = create(inner)

    const state = reducer({}, resolve('qwer'))

    expect(state).to.not.have.property('misc')
    expect(state).to.be.like({ error: 'asdf', data: [1] })
  })
})
