import { STATUS, prefixAT } from './actions'

const initialState = {
  status: STATUS.IDLE,
  loading: false,
  error: null,
  data: null,
}

const createR = (name, reducer = x => x) => (state = initialState, action) => {
  const { type, payload, meta } = action

  if (!meta || (meta && meta.name !== name)) return state
  if (!type || !type.startsWith(prefixAT(name))) return state

  const innerState = { error: state.error, data: state.data }
  const innerAction = { type: meta.status, payload: action.payload, error: action.error }

  switch (meta.status) {
    case STATUS.IDLE:
      return initialState
    case STATUS.PENDING:
      reducer(innerState, innerAction)
      return {
        status: STATUS.PENDING,
        loading: true,
        error: null,
        data: null,
      }
    case STATUS.FULFILLED:
      reducer(innerState, innerAction)
      return {
        status: STATUS.FULFILLED,
        loading: false,
        error: null,
        data: payload,
      }
    case STATUS.REJECTED:
      reducer(innerState, innerAction)
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
