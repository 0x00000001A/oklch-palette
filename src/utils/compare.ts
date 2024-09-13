import {SchemaColor} from '../state'

export function arrayCompare(arrayA: readonly unknown[], arrayB: readonly unknown[]) {
  return JSON.stringify(arrayA) === JSON.stringify(arrayB)
}

export function truthyCompare() {
  return true
}

export function colorCompare(colorA: SchemaColor, colorB: SchemaColor) {
  return colorA.hex === colorB.hex
}
