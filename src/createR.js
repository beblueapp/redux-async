import { STATUS, prefixAT } from './actions'

const initialState = {
  status: STATUS.IDLE,
  loading: false,
  error: null,
  data: null,
}

const defaultReducer = (state, { type, payload }) => {
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
    default:
      return state
  }
}

const trackingReducer = (state, { type }) => {
  switch (type) {
    case STATUS.PENDING:
      return {
        status: STATUS.PENDING,
        loading: true,
      }
    case STATUS.FULFILLED:
      return {
        status: STATUS.FULFILLED,
        loading: false,
      }
    case STATUS.REJECTED:
      return {
        status: STATUS.REJECTED,
        loading: false,
      }
    default:
      return state
  }
}

const createR = (name, resultReducer = defaultReducer) => {
  const prefix = prefixAT(name)

  const guard = ({ type, meta }) => {
    if (!meta || meta.name !== name) return false
    if (!type || !type.startsWith(prefix)) return false

    return true
  }

  return (state = initialState, action) => {
    const { meta } = action

    if (!guard(action)) return state
    if (meta.status === STATUS.IDLE) return initialState

    const resultState = { error: state.error, data: state.data }
    const trackingState = { status: state.status, loading: state.loading }
    const innerAction = { type: meta.status, payload: action.payload, error: action.error }

    const { error, data } = resultReducer(resultState, innerAction)
    const { status, loading } = trackingReducer(trackingState, innerAction)

    return {
      status,
      loading,
      error,
      data,
    }
  }
}

export default createR
