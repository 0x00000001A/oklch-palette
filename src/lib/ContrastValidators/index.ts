// import {apcaw3} from './apcaw3.ts'
import {apcaw3} from './apcaw3.ts'
import {wcag22} from './wcag22.ts'

const validators = {
  apcaw3,
  wcag22
} as const

export const validatorsNames = Object.keys(validators)

export const validateContrast = (
  validatorName: keyof typeof validators,
  foregroundColor: number[],
  backgroundColor: number[]
) => {
  return validators[validatorName](foregroundColor, backgroundColor)
}
