import {useCallback, useLayoutEffect, useRef} from 'react'

import {AnyFunction} from '../utils/types.ts'

const useEffectEvent = <F extends AnyFunction>(callback: F): F => {
  const ref = useRef(callback)

  useLayoutEffect(() => {
    ref.current = callback
  })

  return useCallback((args: Parameters<F>) => {
    return ref.current(args)
  }, []) as F
}

export default useEffectEvent
