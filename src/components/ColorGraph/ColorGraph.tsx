import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {ColorRangePicker} from '../ColorRangePicker'
import {useColorsStore} from '../../state'
import {ColorGraphProps} from './types.ts'
import './index.css'
import {Input} from '../Input'

type ColorGraphInputProps = {
  col: number
  channel: number
}

const ColorGraphInput: FC<ColorGraphInputProps> = ({col, channel}) => {
  const {color} = useColorsStore(
    (state) => {
      const color = {...state.colors[state.selectedRow][col]}
      const oklch = [...color.oklch]

      oklch[0] = Number(String(oklch[0] * 100).slice(0, 5))
      oklch[1] = Number(String(oklch[1]).slice(0, 5))
      oklch[2] = Number(String(oklch[2]).slice(0, 5))

      color.oklch = oklch as never

      return {
        color,
        row: state.selectedRow
      }
    },
    (a, b) => a.color.updatedAt === b.color.updatedAt && a.row === b.row
  )

  return (
    <Input
      className={'color-graph__input'}
      style={{
        textAlign: 'center',
        fontSize: 12,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0
      }}
      value={color.oklch[channel]}
      onChange={console.log}
    />
  )
}

const ColorGraph: FC<ColorGraphProps> = ({min, max, step, channel}) => {
  const colorsLen = useColorsStore((state) => state.colNames.length)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState([0, 0])

  const handleImageDataChanged = useCallback(
    (data: {value: ImageData; index: number; updatedAt: number}) => {
      if (!canvasRef.current) {
        return
      }

      const context = canvasRef.current.getContext('2d')!

      let x = data.index * data.value.width + 20

      if (!data.index) {
        x = 0
      }

      context.putImageData(data.value, x, 0)
    },
    []
  )

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current!

    const width = Math.ceil(canvas.width / colorsLen)
    const height = canvas.height

    setCanvasSize([width, height])
  }, [colorsLen])

  const renderColorRangePicker = useCallback(
    (_: number, index: number) => {
      return (
        <ColorRangePicker
          key={index}
          min={min}
          max={max}
          step={step}
          width={canvasSize[0]}
          height={canvasSize[1]}
          index={index}
          channel={channel}
          onImageDataChange={handleImageDataChanged}
        />
      )
    },
    [canvasSize, channel, handleImageDataChanged, max, min]
  )

  const renderColorInput = useCallback(
    (_: number, index: number) => {
      return <ColorGraphInput key={index} col={index} channel={channel} />
    },
    [channel]
  )

  const colorInputs = useMemo(() => {
    return new Array(colorsLen).fill(0).map(renderColorInput)
  }, [colorsLen, renderColorInput])

  const colorRangePickers = useMemo(() => {
    return new Array(colorsLen).fill(0).map(renderColorRangePicker)
  }, [colorsLen, renderColorRangePicker])

  return (
    <div className={'color-graph'}>
      <div className={'color-graph__inputs'}>{colorInputs}</div>
      <div className={'color-graph__canvas-wrapper'}>
        <canvas
          className={'color-graph__canvas'}
          ref={canvasRef}
          width={colorsLen * 40}
          height={140}
        />
        <div className={'color-graph__sliders'}>{colorRangePickers}</div>
      </div>
    </div>
  )
}

export default ColorGraph
