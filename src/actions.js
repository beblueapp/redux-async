export const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}

// I know the action type could be just this, however, the actions logged on
// redux-dev-tools would require us to see its content to know the real intent.
// By prefixing the name with `@@redux-async` I scope the actions, and by
// appending the status I give them meaning.
const prefixAT = name => `@@redux-async/${name}`
const createAT = (name, status) => `${prefixAT(name)}/${status}`

const reset = name => ({
  type: createAT(name, STATUS.IDLE),
  meta: { name, status: STATUS.IDLE },
})

const pending = name => ({
  type: createAT(name, STATUS.PENDING),
  meta: { name, status: STATUS.PENDING },
})

const fulfilled = (name, payload) => ({
  type: createAT(name, STATUS.FULFILLED),
  payload,
  meta: { name, status: STATUS.FULFILLED },
})

const rejected = (name, error) => ({
  type: createAT(name, STATUS.REJECTED),
  payload: error,
  error: true,
  meta: { name, status: STATUS.REJECTED },
})

const factory = name => ({
  reset: () => reset(name),
  pending: () => pending(name),
  fulfilled: payload => fulfilled(name, payload),
  rejected: error => rejected(name, error),
})

export {
  factory as default,
  createAT,
  prefixAT,
  reset,
  pending,
  fulfilled,
  rejected,
}
