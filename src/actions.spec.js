import factory, { STATUS } from './actions'

describe('actions', () => {
  const name = 'NAME'

  it('has type prefixed with @@redux-async/NAME', () => {
    const actions = factory(name)
    const types = Object.values(actions)
      .map(ac => ac().type)

    const prefix = new RegExp(`^@@redux-async/${name}`)

    types.forEach(el => expect(el).to.match(prefix))
  })

  it('has status under `meta`', () => {
    const actions = factory(name)
    const actionStatuses = Object.values(actions)
      .map(ac => ac().meta)
      .map(m => m.status)
    const statuses = Object.values(STATUS)

    expect(actionStatuses).to.be.like(statuses)
  })
})
