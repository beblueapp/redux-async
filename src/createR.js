// @flow
import { STATUS, prefixAT } from './actions'
import type { Action } from './actions'

export type State<D, E> = {
  status: string,
  loading: boolean,
  error: ?E,
  data: ?D
}

const initialState: State<any, any> = {
  status: STATUS.IDLE,
  loading: false,
  error: null,
  data: null
}

type Reducer<D, E> = (State<D, E>, Action<D | E>) => State<D, E>
type CreateR<D, E> = (string) => Reducer<D, E>

const createR: CreateR<any, any> = name => (state = initialState, action) => {
  const { type, payload, meta } = action

  if (!meta || (meta && meta.name !== name)) return state
  if (!type.startsWith(prefixAT(name))) return state

  switch (meta.status) {
    case STATUS.PENDING:
      return {
        status: STATUS.PENDING,
        loading: true,
        error: null,
        data: null
      }
    case STATUS.FULFILLED:
      return {
        status: STATUS.FULFILLED,
        loading: false,
        error: null,
        data: payload
      }
    case STATUS.REJECTED:
      return {
        status: STATUS.REJECTED,
        loading: false,
        error: payload,
        data: null
      }
    default:
      return state
  }
}

export default createR
