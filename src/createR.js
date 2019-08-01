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

const guard = name => ({ type, meta }) => {
  const statuses = Object.values(STATUS)

  if (!meta || (meta && meta.name !== name)) return false
  if (!type || !type.startsWith(prefixAT(name))) return false
  if (!statuses.includes(meta.status)) return false

  return true
}

const createR = (name, resultReducer = defaultReducer) => (state = initialState, action) => {
  const { meta } = action

  if (!guard(name)(action)) return state
  if (meta.status === STATUS.IDLE) return initialState

  const innerResultState = { error: state.error, data: state.data }
  const innerTrackingState = { status: state.status, loading: state.loading }
  const innerAction = { type: meta.status, payload: action.payload, error: action.error }

  const { error, data } = resultReducer(innerResultState, innerAction)
  const { status, loading } = trackingReducer(innerTrackingState, innerAction)

  return {
    status,
    loading,
    error,
    data,
  }
}

export default createR
