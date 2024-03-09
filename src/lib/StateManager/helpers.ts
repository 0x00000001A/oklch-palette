export const defaultEqualityFn = <T>(prevValue: T, nextValue: T) => {
  if (typeof prevValue === 'function') {
    return true
  }

  return prevValue === nextValue
}

export const defaultSelector = <T>(state: T) => {
  return state
}
