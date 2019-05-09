import asyncAction from './action'

describe('asyncAction', () => {
  it('pipes the received parameters to given function', () => {
    const func = sinon.fake()
    const action = asyncAction('NAME', func)

    action(1, 2, 3)(() => {})

    expect(func.calledOnce).to.be.true
    expect(func.calledWith(1, 2, 3)).to.be.true
  })

  it('creates a function that returns a thunk', () => {
    const action = asyncAction('NAME', () => {})

    const thunk = action()

    expect(thunk).to.be.an.instanceof(Function)
  })

  it('calls func only when thunk runs', () => {
    const func = sinon.fake()
    const action = asyncAction('NAME', func)

    const thunk = action()

    expect(func.notCalled).to.be.true

    thunk(() => {})

    expect(func.calledOnce).to.be.true
  })

  describe('function wrapping whithin Promise', () => {
    it('returns a resolved promise with func results', () => {
      const func = () => 2
      const action = asyncAction('NAME', func)

      const promise = action()(() => {})

      return expect(promise).to.become(2)
    })

    it('returns a resolved promise indepently of func results', () => {
      const err = new Error('Something bad happened')
      const func = () => err
      const action = asyncAction('NAME', func)

      const promise = action()(() => {})

      return expect(promise).to.become(err)
    })

    it('returns a rejected promise if the function throws', () => {
      const msg = 'Something bad happened'
      const func = sinon.stub().throws('Unexpected', msg)
      const action = asyncAction('NAME', func)

      const promise = action()(() => {})

      return expect(promise).to.eventually.be.rejectedWith(Error, msg)
    })

    it('doesn\'t delay func, execute it synchronously', () => {
      const func = sinon.fake()
      const action = asyncAction('NAME', func)

      action()(() => {})

      // By checking that it was called we can be sure that it wasn't delayed
      expect(func.calledOnce).to.be.true
    })
  })

  describe('dispatches according to Promise\'s states', () => {
    it('PENDING before calling function', () => {
      const func = sinon.fake()
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      action()(dispatcher)

      expect(dispatcher.calledBefore(func)).to.be.true
      expect(func.calledAfter(dispatcher)).to.be.true
      expect(dispatcher.firstCall.args[0]).to.have.property('type', 'NAME_PENDING')
    })

    it('FULFILLED on promise resolution', () => {
      let outerResolve = () => {}
      const func = () => new Promise((resolve) => { outerResolve = resolve })
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      const result = action()(dispatcher)
      outerResolve(1)

      return result.then(() => {
        expect(dispatcher.calledTwice).to.be.true
        expect(dispatcher.secondCall.args[0]).to.have.property('type', 'NAME_FULFILLED')
      })
    })

    it('REJECTED on promise rejection', () => {
      let outerReject = () => {}
      const func = sinon.fake(() => new Promise((resolve, reject) => { outerReject = reject }))
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      const result = action()(dispatcher)
      outerReject(1)

      return result.catch(() => {
        expect(dispatcher.calledTwice).to.be.true
        expect(dispatcher.secondCall.args[0]).to.have.property('type', 'NAME_REJECTED')
      })
    })
  })

  describe('actions have metadata for Promise\'s states', () => {
    it('has the name as given on dispatches', () => {
      const func = () => Promise.resolve({})
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      const result = action()(dispatcher)

      return result.then(() => {
        expect(dispatcher.firstCall.args[0]).to.be.like({ meta: { name: 'NAME' } })
        expect(dispatcher.secondCall.args[0]).to.be.like({ meta: { name: 'NAME' } })
      })
    })

    it('sends different status on different calls', () => {
      const func = () => Promise.reject(new Error('Something went wrong'))
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      const result = action()(dispatcher)

      return result.catch(() => {
        expect(dispatcher.firstCall.args[0]).to.be.like({ meta: { status: 'PENDING' } })
        expect(dispatcher.secondCall.args[0]).to.be.like({ meta: { status: 'REJECTED' } })
      })
    })
  })

  describe('actions are FSA compliant', () => {
    it('has no payload on PENDING', () => {
      const func = sinon.fake()
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      action()(dispatcher)

      expect(dispatcher.firstCall.args[0]).to.be.like({ type: 'NAME_PENDING' })
    })

    it('has function result as payload on FULFILLED', () => {
      const payload = { data: 'Result' }
      const func = () => Promise.resolve(payload)
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      const result = action()(dispatcher)

      return result.then(() => {
        expect(dispatcher.secondCall.args[0]).to.be.like({
          type: 'NAME_FULFILLED',
          payload
        })
      })
    })

    it('has error flag and error payload on REJECTED', () => {
      const error = new Error('Something went wrong')
      const func = () => Promise.reject(error)
      const dispatcher = sinon.fake()
      const action = asyncAction('NAME', func)

      const result = action()(dispatcher)

      return result.catch(() => {
        expect(dispatcher.secondCall.args[0]).to.be.like({
          type: 'NAME_REJECTED',
          payload: error,
          error: true
        })
      })
    })
  })

  describe('actions that need store\'s state', () => {
    it('passes getState from thunk to function returned by func', () => {
      const getState = () => ({})
      const innerThunk = sinon.fake(() => {})
      const func = () => innerThunk
      const action = asyncAction('NAME', func)

      action()(() => {}, getState)

      expect(innerThunk.calledOnce).to.be.true
      expect(innerThunk.calledWith(getState)).to.be.true
    })
  })
})
