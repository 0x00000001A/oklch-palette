export function defaultEqualityFn<T>(prevValue: T, nextValue: T) {
  if (typeof prevValue === 'function' || typeof nextValue === 'function') {
    return true
  }

  return prevValue === nextValue
}

export function defaultSelector<T>(state: T) {
  return state
}

export function selectorCreator<GState>() {
  return function createSelector<GResult, GArgs extends readonly unknown[]>(
    callback: (...args: GArgs) => (state: GState) => GResult
  ) {
    return (...args: GArgs) => callback(...args)
  }
}
