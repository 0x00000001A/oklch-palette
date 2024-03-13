import {useEffect, useRef} from 'react'

import {AnyFunction} from '../utils/types.ts'

export type EventListenerTarget = Document | Element | HTMLElement | Window

function useEventListener<GEventName extends keyof HTMLElementEventMap>(
  target: HTMLElement,
  eventName: GEventName,
  handler: (ev: HTMLElementEventMap[GEventName]) => void,
  options?: AddEventListenerOptions | boolean
): void

function useEventListener<GEventName extends keyof ElementEventMap>(
  target: Element,
  eventName: GEventName,
  handler: (ev: ElementEventMap[GEventName]) => void,
  options?: AddEventListenerOptions | boolean
): void

function useEventListener<GEventName extends keyof DocumentEventMap>(
  target: Document,
  eventName: GEventName,
  handler: (ev: DocumentEventMap[GEventName]) => void,
  options?: AddEventListenerOptions | boolean
): void

function useEventListener<GEventName extends keyof WindowEventMap>(
  target: Window,
  eventName: GEventName,
  handler: (ev: WindowEventMap[GEventName]) => void,
  options?: AddEventListenerOptions | boolean
): void

function useEventListener(
  target: EventListenerTarget,
  eventName: string,
  handler: AnyFunction,
  options: AddEventListenerOptions | boolean
): void

function useEventListener(
  target: EventListenerTarget,
  eventName: string,
  handler: AnyFunction,
  options?: AddEventListenerOptions | boolean
) {
  const handlerRef = useRef(handler)

  useEffect(() => {
    const wrappedHandler = (event: Event) => {
      handlerRef.current(event)
    }

    target.addEventListener(eventName, wrappedHandler, options)

    return () => {
      target.removeEventListener(eventName, wrappedHandler, {
        capture: typeof options === 'object' ? options.capture : options
      })
    }
  }, [eventName, handler, options, target])
}

export default useEventListener
