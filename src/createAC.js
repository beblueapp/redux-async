// https://blog.logrocket.com/managing-asynchronous-actions-in-redux-1bc7d28a00c6
// https://medium.com/skyshidigital/simplify-redux-request-success-failure-pattern-ce77340eae06

import actions from './actions'

const createAC = (name, func) => {
  const { pending, fulfilled, rejected } = actions(name)

  return (...args) => (dispatch, getState) => {
    dispatch(pending())

    return new Promise((resolve) => {
      const result = func(...args)

      if (typeof result === 'function') {
        resolve(result(getState))
      } else {
        resolve(result)
      }
    }).then(
      (value) => {
        dispatch(fulfilled(value))

        return value
      }, (reason) => {
        dispatch(rejected(reason))

        throw reason
      },
    )
  }
}

export default createAC
