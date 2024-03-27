import {useSyncExternalStoreWithSelector} from 'use-sync-external-store/with-selector'

import {defaultEqualityFn, defaultSelector} from './helpers.ts'
import {StoreCreator, StoreMethods, StoreSubscriber} from './types.ts'

export const createStore = <GState>(storeCreator: StoreCreator<GState>) => {
  if (typeof storeCreator !== 'function') {
    throw new Error('Function expected')
  }

  let state: GState
  let history: Partial<GState>[] = []
  let historyPosition = -1
  const listeners = new Set<StoreSubscriber<GState>>()

  // mb I need to limit the history size
  function addHistoryRecord(nextState: Partial<GState>, override?: boolean) {
    if (override) {
      history = [nextState]
      historyPosition = 0
    } else {
      if (historyPosition !== history.length - 1) {
        history.splice(historyPosition)
        historyPosition = history.length - 1
      }

      // it should be enough for cur req
      history.push(JSON.parse(JSON.stringify(nextState)))
      historyPosition += 1
    }
  }

  const storeMethods: StoreMethods<GState> = {
    destroy() {
      listeners.clear()
    },

    getState() {
      return state
    },

    setState(
      partial: ((state: GState) => Partial<GState>) | Partial<GState>,
      replace?: boolean,
      isHistoryOperation?: boolean
    ) {
      const nextState = typeof partial === 'function' ? partial(state) : partial

      if (!Object.is(nextState, state)) {
        const previousState = state

        if (!isHistoryOperation) {
          addHistoryRecord(nextState, replace)
        }

        state =
          replace ?? typeof nextState !== 'object'
            ? (nextState as unknown as GState)
            : Object.assign({}, state, nextState)

        listeners.forEach((listener) => {
          listener(state, previousState)
        })
      }
    },

    subscribe(listener: StoreSubscriber<GState>) {
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    }
  }

  state = storeCreator(storeMethods.setState, storeMethods.getState, storeMethods)

  const historyCallback = (event: KeyboardEvent) => {
    if (event.key.toLowerCase() === 'z' && event.metaKey) {
      const nextPosition = event.shiftKey ? historyPosition + 1 : historyPosition - 1

      historyPosition = Math.max(0, Math.min(nextPosition, history.length - 1))

      const patch = history[nextPosition]

      if (patch) {
        storeMethods.setState(patch, undefined, true)
      }
    }
  }

  window.addEventListener('keydown', historyCallback, {capture: true})

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
