import { STATUS, idle, pending, fulfilled, rejected } from './actions'

describe('actions', () => {
  const name = 'NAME'

  // I know the action type could be just this, however, the actions logged on
  // redux-dev-tools would require us to see its content to know the real intent.
  // By prefixing the name with `@@redux-async` I scope the actions, and by
  // appending the status I give them meaning.
  it('has type prefixed with @@redux-async/NAME', () => {
    const { type: tIdle } = idle(name)
    const { type: tPending } = pending(name)
    const { type: tFulfilled } = fulfilled(name, null)
    const { type: tRejected } = rejected(name, null)

    const types = [tIdle, tPending, tFulfilled, tRejected]
    const prefix = new RegExp(`^@@redux-async/${name}`)

    types.forEach(el => expect(el).to.match(prefix))
  })

  it('has status under `meta`', () => {
    const { meta: mIdle } = idle(name)
    const { meta: mPending } = pending(name)
    const { meta: mFulfilled } = fulfilled(name, null)
    const { meta: mRejected } = rejected(name, null)

    const pairs = [
      [mIdle, STATUS.IDLE],
      [mPending, STATUS.PENDING],
      [mFulfilled, STATUS.FULFILLED],
      [mRejected, STATUS.REJECTED],
    ]

    pairs.forEach(([meta, status]) => expect(meta.status).to.be.equal(status))
  })
})
