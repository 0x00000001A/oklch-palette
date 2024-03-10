export const deferredPromise = <T>() => {
  let resolve: (value: PromiseLike<T> | T) => void = () => undefined
  let reject: (reason?: unknown) => void = () => undefined

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return {promise, reject, resolve}
}
