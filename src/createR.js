// @flow
import { STATUS, prefixAT } from './actions'
import type { Action } from './actions'

export type State<D> = {
  status: string,
  loading: boolean,
  error: boolean,
  data: D
}

const initialState: State<any> = {
  status: 'IDLE',
  loading: false,
  error: false,
  data: null
}

type Reducer<D, E> = (State<D>, Action<D | E>) => State<D>
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

export default createR
