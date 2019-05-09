// @flow
import type { Action } from 'redux'

const STATUS = {
  IDLE: 'IDLE',
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}

const types = (name: string): [string, string, string] => [
  `${name}_${STATUS.PENDING}`, `${name}_${STATUS.FULFILLED}`, `${name}_${STATUS.REJECTED}`
]

export type AsyncStatus = $Keys<typeof STATUS>
export type AsyncMeta = { name: string, status: AsyncStatus }
export type AsyncAction<P> = Action<P, AsyncMeta>
export type State<D> = {
  status: string,
  loading: boolean,
  error: boolean,
  data: D
}

export {
  STATUS,
  types
}
