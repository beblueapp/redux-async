import actions from './actions'

const createAC = (name, func) => {
  const { execute, resolve, reject } = actions(name)

  return (...args) => (dispatch, getState) => {
    dispatch(execute())

    return new Promise((res) => {
      const result = func(...args)

      if (typeof result === 'function') {
        res(result(getState))
      } else {
        res(result)
      }
    }).then(
      (value) => {
        dispatch(resolve(value))

        return value
      }, (reason) => {
        dispatch(reject(reason))

        throw reason
      },
    )
  }
}

export default createAC
