export const cls = (...args: unknown[]) => {
  return args.filter(Boolean).join(' ')
}
