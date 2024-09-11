export type AnalyzerResult = {
  backgroundColor: number[]
  foregroundColor: number[]
  label: string
  success: boolean
  value: number | string
}

export type Analyzer = (
  foregroundColor: number[],
  backgroundColor: number[]
) => AnalyzerResult[]
