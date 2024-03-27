import {RefObject, useCallback, useEffect} from 'react'

import useEffectEvent from './useEffectEvent.ts'
import useEventListener from './useEventListener.ts'

type DraggableElement = RefObject<HTMLElement>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getDatasetValue<E extends HTMLElement, T extends (v: string) => any>(
  element: E,
  key: string,
  fallback: string = '',
  parser: T = ((v: string) => v) as T
): ReturnType<T> {
  return parser(element.dataset[key] || fallback)
}

function cssNumber(value: number, postfix: string = 'px') {
  return `${value}${postfix}`
}

function useDraggable(
  elementRef: DraggableElement,
  onMove: (x: number, y: number, parentWidth: number, parentHeight: number) => void,
  getInitialPosition?: () => {left: string; top: string}
) {
  const handleMouseMove = useEffectEvent((eventData: Event) => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const event = eventData as MouseEvent

    event.preventDefault()

    const newPos1 = getDatasetValue(element, 'pos3', '0', parseFloat) - event.clientX
    const newPos2 = getDatasetValue(element, 'pos4', '0', parseFloat) - event.clientY
    const newPos3 = event.clientX
    const newPos4 = event.clientY

    const parent = element.parentElement

    if (!parent) {
      console.error('Unable to get parentNode')
      return
    }

    const minTop = -element.offsetHeight / 2
    const minLeft = -element.offsetWidth / 2
    const maxTop = parent.offsetHeight + minTop
    const maxLeft = parent.offsetWidth + minLeft
    const curTop = element.offsetTop - newPos2
    const curLef = element.offsetLeft - newPos1

    const newTop = Math.min(Math.max(element.offsetTop - newPos2, minTop), maxTop)
    const newLeft = Math.min(Math.max(element.offsetLeft - newPos1, minLeft), maxLeft)

    element.dataset.pos1 = newPos1.toString()
    element.dataset.pos2 = newPos2.toString()
    element.dataset.pos3 =
      curLef > minLeft && curLef < maxLeft
        ? newPos3.toString()
        : (element.getBoundingClientRect().left + element.offsetWidth / 2).toString()
    element.dataset.pos4 =
      curTop > minTop && curTop < maxTop
        ? newPos4.toString()
        : (element.getBoundingClientRect().top + element.offsetHeight / 2).toString()

    element.style.top = cssNumber(newTop)
    element.style.left = cssNumber(newLeft)

    if (onMove) {
      onMove(
        newLeft + element.offsetWidth / 2,
        newTop + element.offsetHeight / 2,
        parent.offsetWidth,
        parent.offsetHeight
      )
    }
  })

  const handleMouseUp = useEffectEvent(() => {
    document.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mousemove', handleMouseMove)
  })

  const handleMouseDown = useEffectEvent((eventData: Event) => {
    const element = elementRef.current

    if (!element) {
      return
    }

    const event = eventData as MouseEvent

    event.preventDefault()
    // relative to click - event.clientX.toString()
    //                   - event.clientY.toString()
    element.dataset.pos3 = (
      element.getBoundingClientRect().left +
      element.offsetWidth / 2
    ).toString()
    element.dataset.pos4 = (
      element.getBoundingClientRect().top +
      element.offsetHeight / 2
    ).toString()

    handleMouseMove(event)

    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mousemove', handleMouseMove)
  })

  const handleInit = useCallback(() => {
    const element = elementRef.current

    if (element) {
      if (getInitialPosition) {
        const initialPosition = getInitialPosition()

        element.style.left = initialPosition.left
        element.style.top = initialPosition.top
      }

      element.parentNode?.addEventListener('mousedown', handleMouseDown)
    }

    return () => {
      if (element) {
        element.parentNode?.removeEventListener('mousedown', handleMouseDown)
      }

      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [elementRef, getInitialPosition, handleMouseDown, handleMouseMove, handleMouseUp])

  useEventListener(elementRef, 'mousedown', handleMouseDown)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(handleInit, [])
}

export default useDraggable
