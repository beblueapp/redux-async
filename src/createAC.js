// https://blog.logrocket.com/managing-asynchronous-actions-in-redux-1bc7d28a00c6
// https://medium.com/skyshidigital/simplify-redux-request-success-failure-pattern-ce77340eae06

import { pending, fulfilled, rejected } from './actions'

const createAC = (name, func) => (...args) => (dispatch, getState) => {
  dispatch(pending(name))

  return new Promise((resolve) => {
    const result = func(...args)

    if (typeof result === 'function') {
      resolve(result(getState))
    } else {
      resolve(result)
    }
  }).then(
    (value) => {
      dispatch(fulfilled(name, value))

      return value
    }, (reason) => {
      dispatch(rejected(name, reason))

      throw reason
    },
  )
}

export default createAC
