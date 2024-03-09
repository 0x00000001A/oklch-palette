export function localStorageGet<T>(key: string, fallback?: T): T | undefined {
  const result = localStorage.getItem(key)

  if (!result) {
    return fallback
  }

  return JSON.parse(result) as T
}
