import createAC from './createAC'
import factory from './actions'

jest.mock('./actions', () => {
  // eslint-disable-next-line global-require
  const sinon = require('sinon')
  const execute = sinon.spy()
  const resolve = sinon.spy()
  const reject = sinon.spy()

  return {
    __esModule: true,
    default: () => ({
      execute,
      resolve,
      reject,
    }),
  }
})

const { execute, resolve, reject } = factory()
afterEach(() => { sinon.reset() })

describe('createAC', () => {
  it('pipes the received parameters to given function', () => {
    const func = sinon.fake()
    const action = createAC('NAME', func)

    action(1, 2, 3)(() => {})

    expect(func.calledOnce).to.be.true
    expect(func.calledWith(1, 2, 3)).to.be.true
  })

  it('creates a function that returns a thunk', () => {
    const action = createAC('NAME', () => {})

    const thunk = action()

    expect(thunk).to.be.an.instanceof(Function)
  })

  it('calls func only when thunk runs', () => {
    const func = sinon.fake()
    const action = createAC('NAME', func)

    const thunk = action()

    expect(func.notCalled).to.be.true

    thunk(() => {})

    expect(func.calledOnce).to.be.true
  })

  describe('function wrapping whithin Promise', () => {
    it('returns a resolved promise with func results', () => {
      const func = () => 2
      const action = createAC('NAME', func)

      const promise = action()(() => {})

      return expect(promise).to.become(2)
    })

    it('returns a resolved promise indepently of func results', () => {
      const err = new Error('Something bad happened')
      const func = () => err
      const action = createAC('NAME', func)

      const promise = action()(() => {})

      return expect(promise).to.become(err)
    })

    it('returns a rejected promise if the function throws', () => {
      const msg = 'Something bad happened'
      const func = sinon.stub().throws('Unexpected', msg)
      const action = createAC('NAME', func)

      const promise = action()(() => {})

      return expect(promise).to.eventually.be.rejectedWith(Error, msg)
    })

    it('doesn\'t delay func, execute it synchronously', () => {
      const func = sinon.fake()
      const action = createAC('NAME', func)

      action()(() => {})

      // By checking that it was called we can be sure that it wasn't delayed
      expect(func.calledOnce).to.be.true
    })
  })

  describe('dispatches according to Promise\'s states', () => {
    it('calls execute before calling the function', () => {
      const func = sinon.fake()
      const dispatcher = sinon.fake()
      const action = createAC('NAME', func)

      action()(dispatcher)

      expect(dispatcher.calledBefore(func)).to.be.true
      expect(func.calledAfter(dispatcher)).to.be.true
      expect(execute.calledOnce).to.be.true
    })

    it('calls resolve on promise resolution', () => {
      let outerResolve = () => {}
      const func = () => new Promise((res) => { outerResolve = res })
      const dispatcher = sinon.fake()
      const action = createAC('NAME', func)

      const result = action()(dispatcher)
      outerResolve(1)

      return result.then(() => {
        expect(dispatcher.calledTwice).to.be.true
        expect(resolve.calledOnce).to.be.true
      })
    })

    it('calls reject on promise rejection', () => {
      let outerReject = () => {}
      const func = sinon.fake(() => new Promise((res, rej) => { outerReject = rej }))
      const dispatcher = sinon.fake()
      const action = createAC('NAME', func)

      const result = action()(dispatcher)
      outerReject(1)

      return result.catch(() => {
        expect(dispatcher.calledTwice).to.be.true
        expect(reject.calledOnce).to.be.true
      })
    })
  })

  describe('calls actions with function\'s result', () => {
    it('pass result to resolve on success', () => {
      const payload = { data: 'Result' }
      const func = () => Promise.resolve(payload)
      const dispatcher = sinon.fake()
      const action = createAC('NAME', func)

      const result = action()(dispatcher)

      return result.then(() => {
        expect(resolve.firstCall.args[0]).to.be.equal(payload)
      })
    })

    it('pass error to reject on failure', () => {
      const error = new Error('Something went wrong')
      const func = () => Promise.reject(error)
      const dispatcher = sinon.fake()
      const action = createAC('NAME', func)

      const result = action()(dispatcher)

      return result.catch(() => {
        expect(reject.firstCall.args[0]).to.be.equal(error)
      })
    })
  })

  describe('actions that need store\'s state', () => {
    it('passes getState from thunk to function returned by func', () => {
      const getState = () => ({})
      const innerThunk = sinon.fake(() => {})
      const func = () => innerThunk
      const action = createAC('NAME', func)

      action()(() => {}, getState)

      expect(innerThunk.calledOnce).to.be.true
      expect(innerThunk.calledWith(getState)).to.be.true
    })
  })
})
