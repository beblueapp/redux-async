import factory from './index'

describe('redux-async', () => {
  it('returns actions, creator and reducer', () => {
    const actual = factory('NAME', { creator: () => {}, reducer: () => {} })

    expect(actual).to.have.property('actions')
    expect(actual).to.have.property('creator')
    expect(actual).to.have.property('reducer')
  })
})
