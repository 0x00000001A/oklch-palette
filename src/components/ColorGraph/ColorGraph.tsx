import {FC, useCallback, useEffect, useMemo, useRef, useState} from 'react'

import {LCH_CHANNELS_NAMES, useColorsStore} from '../../state'
import {colorsWorkerManager} from '../../worker'
import {ColorsMessageResponse} from '../../worker/types.ts'
import {ColorRangePicker} from '../ColorRangePicker'
import {Input} from '../Input'

import {ColorGraphProps} from './types.ts'

import './index.css'

type ColorGraphInputProps = {
  channel: LCH_CHANNELS_NAMES
  col: number
}

const ColorGraphInput: FC<ColorGraphInputProps> = ({channel, col}) => {
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
      style={{
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1,
        fontSize: 12,
        textAlign: 'center'
      }}
      className={'color-graph__input'}
      value={color.oklch[channel]}
      onChange={console.log}
    />
  )
}

const ColorGraph: FC<ColorGraphProps> = ({channel, max, min, step}) => {
  const colorsLen = useColorsStore((state) => state.colNames.length)

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

      let x = data.index * data.width + 20

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

  const colorInputs = useMemo(() => {
    return new Array(colorsLen)
      .fill(0)
      .map((_, index: number) => (
        <ColorGraphInput channel={channel} col={index} key={index} />
      ))
  }, [channel, colorsLen])

  const colorRangePickers = useMemo(() => {
    return new Array(colorsLen)
      .fill(0)
      .map((_: number, index: number) => (
        <ColorRangePicker
          channel={channel}
          height={canvasSize[1]}
          index={index}
          key={index}
          max={max}
          min={min}
          step={step}
          width={canvasSize[0]}
        />
      ))
  }, [canvasSize, channel, colorsLen, max, min, step])

  const subscribeToColorsWorkerUpdates = () => {
    colorsWorkerManager.subscribe(channel, handleImageDataReceived)

    return () => {
      colorsWorkerManager.unsubscribe(channel, handleImageDataReceived)
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(subscribeToColorsWorkerUpdates, [])

  return (
    <div className={'color-graph'}>
      <div className={'color-graph__inputs'}>{colorInputs}</div>
      <div className={'color-graph__canvas-wrapper'}>
        <canvas
          className={'color-graph__canvas'}
          height={140}
          ref={canvasRef}
          width={colorsLen * 40}
        />
        <div className={'color-graph__sliders'}>{colorRangePickers}</div>
      </div>
    </div>
  )
}

export default ColorGraph
