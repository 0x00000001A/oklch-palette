export enum SelectActions {
  Close,
  First,
  Last,
  Next,
  Open,
  PageDown,
  PageUp,
  Previous,
  Select,
  Type
}

export const openActions = [
  SelectActions.First,
  SelectActions.Last,
  SelectActions.Open,
  SelectActions.Type
]

export const closeActions = [SelectActions.Close, SelectActions.Select]

export const navigationActions = [
  SelectActions.First,
  SelectActions.Last,
  SelectActions.Previous,
  SelectActions.Next,
  SelectActions.PageUp,
  SelectActions.PageDown
]
