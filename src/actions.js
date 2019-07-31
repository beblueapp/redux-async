export const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED',
}

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

export {
  createAT,
  prefixAT,
  reset,
  pending,
  fulfilled,
  rejected,
}
