export function objectsArrayToStringArray<
  R extends Record<string, string> | object,
  Z extends keyof R
>(source: R[], key: Z = 'name' as Z) {
  return source.map((entry) => {
    return String(entry[key])
  })
}
