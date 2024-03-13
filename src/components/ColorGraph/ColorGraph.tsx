import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react'

import {GRAPH_HEIGHT, GRAPH_WIDTH} from '../../constants/colors.ts'
import {useColorsStore} from '../../state'
import {colorsWorkerManager} from '../../worker'
import {ColorsMessageResponse} from '../../worker/types.ts'
import {ColorRangePicker} from '../ColorRangePicker'

import ColorGraphValue from './ColorGraphValue.tsx'
import {ColorGraphProps} from './types.ts'

import './index.css'

const ColorGraph: FC<ColorGraphProps> = ({
  channel,
  colorsFrom = 'row',
  max,
  min,
  step
}) => {
  const colorsLen = useColorsStore((state) => {
    if (colorsFrom === 'column') {
      return state.rowNames.length
    }

    return state.colNames.length
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [canvasSize, setCanvasSize] = useState([0, 0])

  const handleImageDataReceived = useCallback(
    ({data}: MessageEvent<ColorsMessageResponse>) => {
      if (!canvasRef.current) {
        return
      }

      const context = canvasRef.current.getContext('2d')

      if (!context) {
        console.error('Failed to initiate canvas context')
        return
      }

      const imageData = new ImageData(
        new Uint8ClampedArray(data.buffer),
        data.width,
        data.height
      )

      let x = data.index * data.width + Math.round(data.width / 2)

      if (!data.index) {
        x = 0
      }

      context.putImageData(imageData, x, 0)
    },
    []
  )

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    const canvas = canvasRef.current
    const width = Math.ceil(canvas.width / colorsLen)
    const height = canvas.height

    setCanvasSize([width, height])
  }, [colorsLen])

  const colorValues = useMemo(() => {
    return new Array(colorsLen)
      .fill(0)
      .map((_, index: number) => (
        <ColorGraphValue
          channel={channel}
          colorsFrom={colorsFrom}
          index={index}
          key={index}
        />
      ))
  }, [channel, colorsFrom, colorsLen])

  const colorRangePickers = useMemo(() => {
    return new Array(colorsLen)
      .fill(0)
      .map((_: number, index: number) => (
        <ColorRangePicker
          channel={channel}
          colorsFrom={colorsFrom}
          colorsLength={colorsLen}
          height={canvasSize[1]}
          index={index}
          key={index}
          max={max}
          min={min}
          step={step}
          width={canvasSize[0]}
        />
      ))
  }, [canvasSize, channel, colorsFrom, colorsLen, max, min, step])

  const subscribeToColorsWorkerUpdates = () => {
    const workerChannel = `${channel}-${colorsFrom}`

    colorsWorkerManager.subscribe(workerChannel, handleImageDataReceived)

    return () => {
      colorsWorkerManager.unsubscribe(workerChannel, handleImageDataReceived)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(subscribeToColorsWorkerUpdates, [])

  return (
    <div className={'color-graph'}>
      <div className={'color-graph__values'}>{colorValues}</div>
      <div className={'color-graph__canvas-wrapper'}>
        <canvas
          className={'color-graph__canvas'}
          height={GRAPH_HEIGHT}
          ref={canvasRef}
          width={GRAPH_WIDTH}
        />
        <div className={'color-graph__sliders'}>{colorRangePickers}</div>
      </div>
    </div>
  )
}

export default ColorGraph
