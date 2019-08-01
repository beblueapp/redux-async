import actions from './actions'
import createAC from './createAC'
import createR from './createR'

const factory = (name, { creator, reducer }) => {
  const asyncCreator = createAC(name, creator)
  const asyncReducer = createR(name, reducer)

  return {
    actions,
    creator: asyncCreator,
    reducer: asyncReducer,
  }
}

export default factory
