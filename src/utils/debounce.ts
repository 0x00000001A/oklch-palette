import {deferredPromise} from './promise.ts'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Callback<GArguments extends any[] = any, GResult = any> = (
  ...args: GArguments
) => GResult

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CallbackAsync<GArguments extends any[] = any, GResult = any> = (
  ...args: GArguments
) => Promise<GResult>

export const debounceAsync = <GCallback extends CallbackAsync>(
  callback: GCallback,
  delay = 300,
  immediate = false
) => {
  type GArguments = Parameters<GCallback>
  type GResult = Awaited<ReturnType<GCallback>>

  let timeoutId: number | undefined
  let result = deferredPromise<GResult>()

  const finishPromise = (...args: GArguments) => {
    callback.apply(this, args).then(result.resolve).catch(result.reject)
    result = deferredPromise<GResult>()
  }

  return (...args: GArguments) => {
    const later: TimerHandler = (): void => {
      timeoutId = undefined

      if (!immediate) {
        finishPromise(...args)
      }
    }

    const callNow = immediate && !timeoutId
    clearTimeout(timeoutId)

    timeoutId = setTimeout(later, delay)

    if (callNow) {
      finishPromise(...args)
    }

    return result.promise
  }
}
