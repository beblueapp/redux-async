import { STATUS, prefix } from './constants'

// I know the action type could be just `${prefix}/${name}`, however, the
// actions logged on redux-dev-tools would require us to see its content to know
// the real intent. By prefixing the name with `@@redux-async` I scope the
// actions, and by appending the status I give them meaning.
const createAT = (name, status) => `${prefix}/${name}/${status}`

const reset = name => () => ({
  type: createAT(name, STATUS.IDLE),
  meta: { name, status: STATUS.IDLE },
})

const pending = name => () => ({
  type: createAT(name, STATUS.PENDING),
  meta: { name, status: STATUS.PENDING },
})

const fulfilled = name => payload => ({
  type: createAT(name, STATUS.FULFILLED),
  payload,
  meta: { name, status: STATUS.FULFILLED },
})

const rejected = name => error => ({
  type: createAT(name, STATUS.REJECTED),
  payload: error,
  error: true,
  meta: { name, status: STATUS.REJECTED },
})

const createC = name => ({
  reset: reset(name),
  execute: pending(name),
  resolve: fulfilled(name),
  reject: rejected(name),
})

export default createC
