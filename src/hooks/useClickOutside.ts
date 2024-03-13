import {RefObject} from 'react'

import {AnyFunction} from '../utils/types.ts'

import useEventListener from './useEventListener.ts'

export type ClickOutsideTargets =
  | Document
  | Element
  | HTMLElement
  | Window
  | null
  | undefined

export type ClickOutsideTarget<GTarget extends ClickOutsideTargets = Element> =
  RefObject<GTarget>

function useClickOutside(
  target: ClickOutsideTarget | ClickOutsideTarget[],
  callback: AnyFunction
) {
  const wrappedCallback = (event: Event) => {
    let isClickOutside: boolean | undefined = true

    if (Array.isArray(target)) {
      isClickOutside = !target
        .filter((targetRef) => {
          return targetRef.current
        })
        .some((targetRef) => {
          return targetRef.current?.contains(event.target as Element)
        })
    } else {
      isClickOutside = target.current?.contains(event.target as Element)
    }

    if (isClickOutside) {
      callback()
    }
  }

  useEventListener(document, 'mousedown', wrappedCallback)
}

export default useClickOutside
