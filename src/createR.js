import { STATUS, prefixAT } from './actions'

const initialState = {
  status: STATUS.IDLE,
  loading: false,
  error: null,
  data: null,
}

const createR = name => (state = initialState, action) => {
  const { type, payload, meta } = action

  if (!meta || (meta && meta.name !== name)) return state
  if (!type || !type.startsWith(prefixAT(name))) return state

  switch (meta.status) {
    case STATUS.IDLE:
      return initialState
    case STATUS.PENDING:
      return {
        status: STATUS.PENDING,
        loading: true,
        error: null,
        data: null,
      }
    case STATUS.FULFILLED:
      return {
        status: STATUS.FULFILLED,
        loading: false,
        error: null,
        data: payload,
      }
    case STATUS.REJECTED:
      return {
        status: STATUS.REJECTED,
        loading: false,
        error: payload,
        data: null,
      }
    default:
      return state
  }
}

export default createR
