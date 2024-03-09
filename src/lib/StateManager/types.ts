export type StoreSubscriber<R> = (updatedState: R, previousState: R) => void

export type StoreMethods<T> = {
  setState: (updater: (state: T) => Partial<T>, replace?: boolean) => void
  getState: () => T
  subscribe: (listener: StoreSubscriber<T>) => () => void
  destroy: () => void
}

export type StoreCreator<T> = (
  set: StoreMethods<T>['setState'],
  get: StoreMethods<T>['getState'],
  methods?: StoreMethods<T>
) => T
