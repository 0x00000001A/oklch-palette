export type Vector = [number, number, number]

export type Matrix = [Vector, Vector, Vector]

export function multiplyMatrixAndVector(matrix: Matrix, vector: Vector): Vector {
  return [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1] + matrix[0][2] * vector[2],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1] + matrix[1][2] * vector[2],
    matrix[2][0] * vector[0] + matrix[2][1] * vector[1] + matrix[2][2] * vector[2]
  ]
}

export function toFixedTruncate(value: number, decimalsLength: number) {
  if (!Number.isInteger(decimalsLength)) {
    decimalsLength = decimalsLength.toString().split('.').length
  }

  const result = new RegExp('^-?\\d+(?:\.\\d{0,' + decimalsLength + '})?');
  const matches = value.toString().match(result)

  if (!matches) {
    console.error(`Failed to truncate ${value} up to ${decimalsLength}`)
    return value
  }

  return parseFloat(matches[0]);
}
