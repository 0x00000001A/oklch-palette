import {RefObject, useEffect} from 'react'

import {AnyFunction} from '../utils/types.ts'

import useEffectEvent from './useEffectEvent.ts'

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

function useEventListener<GEventName extends keyof HTMLElementEventMap>(
  target: RefObject<EventListenerTarget>,
  eventName: GEventName,
  handler: (ev: HTMLElementEventMap[GEventName]) => void,
  options?: AddEventListenerOptions | boolean
): void

function useEventListener(
  target: EventListenerTarget,
  eventName: string,
  handler: AnyFunction,
  options: AddEventListenerOptions | boolean
): void

function useEventListener(
  target: EventListenerTarget | RefObject<EventListenerTarget>,
  eventName: string,
  handler: AnyFunction,
  options?: AddEventListenerOptions | boolean
) {
  const handlerCallback = useEffectEvent(handler)

  useEffect(() => {
    const targetRef = target as unknown as RefObject<EventListenerTarget>
    const element = (targetRef.current || target) as NonNullable<EventListenerTarget>

    element.addEventListener(eventName, handlerCallback, options)

    return () => {
      element.removeEventListener(eventName, handlerCallback, {
        capture: typeof options === 'object' ? options.capture : options
      })
    }
  }, [eventName, handler, options, target])
}

export default useEventListener
