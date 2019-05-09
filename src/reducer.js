// @flow
// import { includes } from 'lodash'
import type { Action } from 'redux'

import { STATUS } from './types'
import type { State, AsyncMeta } from './types'

const initialState: State<any> = {
  status: 'IDLE',
  loading: false,
  error: false,
  data: null
}

const asyncReducer = <S>(name: string) =>
  // eslint-disable-next-line implicit-arrow-linebreak
  (state: State<S> = initialState, action: Action<S, AsyncMeta>) => {
    const { payload, meta } = action

    if (!meta || (meta && meta.name !== name)) return state
    // if (!includes(types(name), type)) return state

    switch (meta.status) {
      case STATUS.PENDING:
        return {
          status: STATUS.PENDING,
          loading: true,
          error: false,
          data: null
        }
      case STATUS.FULFILLED:
        return {
          status: STATUS.FULFILLED,
          loading: false,
          error: false,
          data: payload
        }
      case STATUS.REJECTED:
        return {
          status: STATUS.REJECTED,
          loading: false,
          error: true,
          data: payload
        }
      default:
        return state
    }
  }

export default asyncReducer
