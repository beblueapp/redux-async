import { STATUS, prefixAT } from './actions'

const initialState = {
  status: STATUS.IDLE,
  loading: false,
  error: null,
  data: null,
}

const defaultReducer = (state, action) => {
  const { type, payload } = action

  switch (type) {
    case STATUS.PENDING:
      return {
        error: null,
        data: null,
      }
    case STATUS.FULFILLED:
      return {
        error: null,
        data: payload,
      }
    case STATUS.REJECTED:
      return {
        error: payload,
        data: null,
      }
    default: return state
  }
}

const createR = (name, reducer = defaultReducer) => (state = initialState, action) => {
  const { type, meta } = action

  if (!meta || (meta && meta.name !== name)) return state
  if (!type || !type.startsWith(prefixAT(name))) return state

  const innerState = { error: state.error, data: state.data }
  const innerAction = { type: meta.status, payload: action.payload, error: action.error }

  switch (meta.status) {
    case STATUS.IDLE:
      return initialState
    case STATUS.PENDING: {
      const { error, data } = reducer(innerState, innerAction)
      return {
        data,
        error,
        status: STATUS.PENDING,
        loading: true,
      }
    }
    case STATUS.FULFILLED: {
      const { error, data } = reducer(innerState, innerAction)
      return {
        data,
        error,
        status: STATUS.FULFILLED,
        loading: false,
      }
    }
    case STATUS.REJECTED: {
      const { error, data } = reducer(innerState, innerAction)
      return {
        data,
        error,
        status: STATUS.REJECTED,
        loading: false,
      }
    }
    default:
      return state
  }
}

export default createR
