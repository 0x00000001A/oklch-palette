export type StoreSubscriber<R> = (updatedState: R, previousState: R) => void

export type StoreMethods<T> = {
  destroy: () => void
  getState: () => T
  setState: (
    updater: ((state: T) => Partial<T>) | Partial<T>,
    replace?: boolean,
    isHistoryOperation?: boolean
  ) => void
  subscribe: (listener: StoreSubscriber<T>) => () => void
}

export type StoreCreator<T> = (
  set: StoreMethods<T>['setState'],
  get: StoreMethods<T>['getState'],
  methods?: StoreMethods<T>
) => T
