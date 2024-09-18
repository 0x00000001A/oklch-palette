export const INSERT_POSITIONS = {
  AFTER: 0,
  BEFORE: 1,
  END: 3,
  START: 4
} as const

export type INSERT_POSITION = (typeof INSERT_POSITIONS)[keyof typeof INSERT_POSITIONS]
