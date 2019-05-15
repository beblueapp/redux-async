// @flow
// https://blog.logrocket.com/managing-asynchronous-actions-in-redux-1bc7d28a00c6
// https://medium.com/skyshidigital/simplify-redux-request-success-failure-pattern-ce77340eae06
import type { ThunkAction, GetState } from 'redux'

import { pending, fulfilled, rejected } from './actions'
import type { Action } from './actions'

type ActionCreator<A> = (...args: any) => ThunkAction<Action<A>, Promise<A>>
type PayloadCreator<A> = (...args: any) => ((GetState) => A) | A
type CreateAC<A> = (name: string, func: PayloadCreator<A>) => ActionCreator<A>

const createAC: CreateAC<any> = (name, func) => (...args) => (dispatch, getState) => {
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
    }
  )
}

export default createAC
