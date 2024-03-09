import {FC, useMemo} from 'react'
import * as analyzers from './analyzers'
import {useColorsStore} from '../../state'
import {Input} from '../Input'

const ContrastChecker: FC = () => {
  const color = useColorsStore(
    (state) => {
      return state.colors[state.selectedRow][state.selectedCol].rgb
    },
    (a, b) => a.toString() === b.toString()
  )

  const results = useMemo(() => {
    const backgroundColors = [
      [255, 255, 255],
      [0, 0, 0]
    ]

    return backgroundColors.map((bgColor) => {
      return analyzers.wcag22(color, bgColor)
    })
  }, [color])

  return (
    <>
      <span
        style={{
          fontSize: `12px`,
          color: `rgb(102 102 102)`,
          textAlign: 'center'
        }}
      >
        WCAG 2.2
      </span>
      {results.map((result, index) => (
        <div
          key={index}
          style={{
            backgroundColor: '#f4f4f4 ',
            borderRadius: 6,
            overflow: 'hidden',
            border: `1px solid rgb(230 230 230)`
          }}
        >
          <div style={{padding: 8}}>
            <Input
              placeholder={'#000000'}
              defaultValue={result.backgroundColor.join(',')}
            />
          </div>
          <div
            style={{
              borderBlock: '1px solid rgb(230 230 230)',
              padding: `8px`,
              color: `rgb(${result.foregroundColor.join(',')})`,
              backgroundColor: `rgb(${result.backgroundColor.join(',')})`,
              textAlign: 'center'
            }}
          >
            Example
          </div>
          <div
            style={{
              padding: `8px`,
              textAlign: 'center'
            }}
          >
            {result.value} - {result.label}
          </div>
        </div>
      ))}
    </>
  )
}

export default ContrastChecker
