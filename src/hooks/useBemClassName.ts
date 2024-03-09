import {cls} from '../utils/cls.ts'
import {DependencyList, useMemo} from 'react'

const bemClassNameBuilder = (baseClassName: string, classNameFromProps?: string) => {
  const result: unknown[] = [baseClassName]

  return {
    build() {
      return cls(...result, classNameFromProps)
    },
    withModifier(modifier: string, condition?: boolean) {
      condition && result.push(`${baseClassName}_${modifier}`)
      return this
    },
    createBlock(blockClassName: string, classNameFromPropsB?: string) {
      return bemClassNameBuilder(
        `${baseClassName}__${blockClassName}`,
        classNameFromPropsB
      )
    }
  }
}

const useBemClassName = <GResult extends object>(
  callback: (builder: typeof bemClassNameBuilder) => GResult,
  deps: DependencyList
) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => callback(bemClassNameBuilder), [callback, ...deps])
}

export default useBemClassName
