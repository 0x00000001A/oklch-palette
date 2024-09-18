export function arrayCompare(arrayA: readonly unknown[], arrayB: readonly unknown[]) {
  return JSON.stringify(arrayA) === JSON.stringify(arrayB)
}

export function colorCompare(colorA: {hex: string}, colorB: {hex: string}) {
  return colorA.hex === colorB.hex
}
