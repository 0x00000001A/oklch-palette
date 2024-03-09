import {useSyncExternalStoreWithSelector} from 'use-sync-external-store/with-selector'
import {defaultEqualityFn, defaultSelector} from './helpers.ts'

import {StoreCreator, StoreMethods, StoreSubscriber} from './types.ts'

export const createStore = <GState>(storeCreator: StoreCreator<GState>) => {
  if (typeof storeCreator !== 'function') {
    throw new Error('Function expected')
  }

  let state: GState
  const listeners = new Set<StoreSubscriber<GState>>()

  const storeMethods: StoreMethods<GState> = {
    setState(partial, replace?: boolean) {
      const nextState = typeof partial === 'function' ? partial(state) : partial

      if (!Object.is(nextState, state)) {
        const previousState = state

        state =
          replace ?? typeof nextState !== 'object'
            ? (nextState as unknown as GState)
            : Object.assign({}, state, nextState)

        listeners.forEach((listener) => listener(state, previousState))
      }
    },

    getState() {
      return state
    },

    subscribe(listener: StoreSubscriber<GState>) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },

    destroy() {
      listeners.clear()
    }
  }

  state = storeCreator(storeMethods.setState, storeMethods.getState, storeMethods)

  return {
    useStoreHook: <GSelectorResult = GState>(
      selector: (state: GState) => GSelectorResult = defaultSelector as never,
      equalityFn: (
        prevValue: GSelectorResult,
        nextValue: GSelectorResult
      ) => boolean = defaultEqualityFn
    ): GSelectorResult => {
      return useSyncExternalStoreWithSelector(
        storeMethods.subscribe,
        storeMethods.getState,
        storeMethods.getState,
        selector,
        equalityFn
      )
    },
    ...storeMethods
  }
}
