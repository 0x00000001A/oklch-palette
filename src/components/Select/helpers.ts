/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/prefer-includes,@typescript-eslint/no-unsafe-argument,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unnecessary-condition */
import {KeyboardEvent} from 'react'

import {SelectActions} from './constants.ts'

export function isElementInView(element: HTMLElement) {
  const {bottom, left, right, top} = element.getBoundingClientRect()

  const windowHeight = innerHeight || document.documentElement.clientHeight
  const windowWidth = innerWidth || document.documentElement.clientWidth

  return top >= 0 && left >= 0 && bottom <= windowHeight && right <= windowWidth
}

export function getActionFromKey(
  event: KeyboardEvent<HTMLDivElement>,
  menuOpen: boolean
) {
  const {altKey, ctrlKey, key, metaKey} = event
  const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' ']

  if (!menuOpen && openKeys.includes(key)) {
    return SelectActions.Open
  }

  if (key === 'Home') {
    return SelectActions.First
  }
  if (key === 'End') {
    return SelectActions.Last
  }

  if (
    key === 'Backspace' ||
    key === 'Clear' ||
    (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
  ) {
    return SelectActions.Type
  }

  // handle keys when open
  if (menuOpen) {
    if (key === 'ArrowUp' && altKey) {
      return SelectActions.Select
    } else if (key === 'ArrowDown' && !altKey) {
      return SelectActions.Next
    } else if (key === 'ArrowUp') {
      return SelectActions.Previous
    } else if (key === 'PageUp') {
      return SelectActions.PageUp
    } else if (key === 'PageDown') {
      return SelectActions.PageDown
    } else if (key === 'Escape') {
      return SelectActions.Close
    } else if (key === 'Enter' || key === ' ') {
      return SelectActions.Select
    }
  }
}

export function filterOptions(options: any = [], filter: string, exclude: string[] = []) {
  return options.filter((option: any) => {
    const matches = option.toLowerCase().indexOf(filter.toLowerCase()) === 0
    return matches && exclude.indexOf(option) < 0
  })
}

export function getIndexByLetter(options: any, filter: string, startIndex = 0) {
  const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)]

  const firstMatch = filterOptions(orderedOptions, filter)[0]
  const allSameLetter = (array: string[]) => array.every((letter) => letter === array[0])

  // first check if there is an exact match for the typed string
  if (firstMatch) {
    return options.indexOf(firstMatch)
  } else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(orderedOptions, filter[0])
    return options.indexOf(matches[0])
  } else {
    return -1
  }
}

export function isScrollable(element: HTMLElement) {
  return element && element.clientHeight < element.scrollHeight
}

export function maintainScrollVisibility(
  activeElement: HTMLElement,
  scrollParent: HTMLElement
) {
  const {offsetHeight, offsetTop} = activeElement
  const {offsetHeight: parentOffsetHeight, scrollTop} = scrollParent

  const isAbove = offsetTop < scrollTop
  const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight

  if (isAbove) {
    scrollParent.scrollTo(0, offsetTop)
  } else if (isBelow) {
    scrollParent.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight)
  }
}
