// @flow
import type { Action as ReduxAction } from 'redux'

export const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

export type Status = $Keys<typeof STATUS>
export type Meta = { name: string, status: Status }
export type Action<P> = ReduxAction<P, Meta>

const prefixAT = (name: string): string => `@@redux-async/${name}`
const createAT = (name: string, status: Status): string => `${prefixAT(name)}/${status}`

const idle = (name: string): Action<void> => ({
  type: createAT(name, STATUS.IDLE),
  meta: { name, status: STATUS.IDLE }
})

const pending = (name: string): Action<void> => ({
  type: createAT(name, STATUS.PENDING),
  meta: { name, status: STATUS.PENDING }
})

const fulfilled = <P>(name: string, payload: P): Action<P> => ({
  type: createAT(name, STATUS.FULFILLED),
  payload,
  meta: { name, status: STATUS.FULFILLED }
})

const rejected = <E>(name: string, error: E): Action<E> => ({
  type: createAT(name, STATUS.REJECTED),
  payload: error,
  error: true,
  meta: { name, status: STATUS.REJECTED }
})

export {
  createAT,
  prefixAT,
  idle,
  pending,
  fulfilled,
  rejected
}
