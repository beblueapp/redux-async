import createC from './actions'
import createAC from './createAC'
import createR from './createR'

const factory = (name, { creator, reducer }) => {
  const asyncCreator = createAC(name, creator)
  const asyncReducer = createR(name, reducer)
  const actions = createC(name)

  return {
    actions,
    creator: asyncCreator,
    reducer: asyncReducer,
  }
}

export {
  factory as default,
  createC,
  createAC,
  createR,
}
