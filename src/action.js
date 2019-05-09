// @flow
// https://blog.logrocket.com/managing-asynchronous-actions-in-redux-1bc7d28a00c6
// https://medium.com/skyshidigital/simplify-redux-request-success-failure-pattern-ce77340eae06
import type { ThunkAction, GetState } from 'redux'

import { STATUS, types } from './types'
import type { AsyncAction } from './types'

const asyncAction = <R>(name: string, func: ((...any) => (((GetState) => R) | R))) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (...args: any): ThunkAction<AsyncAction<any>, Promise<R>> =>
    // eslint-disable-next-line implicit-arrow-linebreak
    (dispatch, getState) => {
      const [pending, fulfilled, rejected] = types(name)

      dispatch({
        type: pending,
        meta: { name, status: STATUS.PENDING }
      })

      return new Promise((resolve) => {
        const result = func(...args)

        if (typeof result === 'function') {
          resolve(result(getState))
        } else {
          resolve(result)
        }
      }).then(
        (value) => {
          dispatch({
            type: fulfilled,
            payload: value,
            meta: { name, status: STATUS.FULFILLED }
          })

          return value
        }, (reason) => {
          dispatch({
            type: rejected,
            payload: reason,
            error: true,
            meta: { name, status: STATUS.REJECTED }
          })

          throw reason
        }
      )
    }

export default asyncAction
