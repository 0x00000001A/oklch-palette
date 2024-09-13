export type AnalyzerResult = {
  backgroundColor: number[]
  foregroundColor: number[]
  label: string
  note?: string
  success: boolean
  value: number | string
}

export type Analyzer = (
  foregroundColor: number[],
  backgroundColor: number[]
) => {
  label: string
  results: {
    backward: AnalyzerResult
    forward: AnalyzerResult
  }
}
