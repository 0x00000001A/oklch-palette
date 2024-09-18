import {createStyles, css} from 'antd-style'
import {observer} from 'mobx-react-lite'
import {FC, useCallback, useEffect, useRef, useState} from 'react'

import {GRAPH_HEIGHT, GRAPH_WIDTH} from '../../constants/colors.ts'
import {PaletteColor} from '../../store/PaletteStore.ts'
import {colorsWorkerManager} from '../../worker'
import {ColorsMessageResponse} from '../../worker/types.ts'
import {ColorRangePicker} from '../ColorRangePicker'

import {ColorGraphProps} from './types.ts'

import './index.css'

// noinspection CssUnresolvedCustomProperty
const useStyles = createStyles(({token}) => ({
  canvasWrapper: css`
    position: relative;
    display: flex;
    overflow: hidden;
    --color-a: ${token.colorFillContent};
    --color-b: ${token.colorBgLayout};
    --size: 6px;
    background-image: linear-gradient(
      -45deg,
      var(--color-a) 25%,
      var(--color-b) 25%,
      var(--color-b) 50%,
      var(--color-a) 50%,
      var(--color-a) 75%,
      var(--color-b) 75%,
      var(--color-b)
    );
    background-size: 6px 6px;
  `,
  root: css`
    background: ${token.colorBgLayout};
    border-radius: ${token.borderRadius}px;
    border: 1px solid ${token.colorBorder};
  `
}))

const ColorGraph: FC<ColorGraphProps & {colors: PaletteColor[]; workerGroup: string}> =
  observer(({channel, colors = [], max, min, step, workerGroup}) => {
    const {styles} = useStyles()

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

    const subscribeToColorsWorkerUpdates = () => {
      const workerChannel = `${channel}-${workerGroup}`

      colorsWorkerManager.subscribe(workerChannel, handleImageDataReceived)

      return () => {
        colorsWorkerManager.unsubscribe(workerChannel, handleImageDataReceived)
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(subscribeToColorsWorkerUpdates, [])

    useEffect(() => {
      if (!canvasRef.current) {
        return
      }

      const canvas = canvasRef.current
      const width = Math.ceil(canvas.width / colors.length)
      const height = canvas.height

      setCanvasSize([width, height])
    }, [colors])

    return (
      <div className={styles.root} style={{width: GRAPH_WIDTH}}>
        <div className={styles.canvasWrapper}>
          <canvas
            className={'color-graph__canvas'}
            height={GRAPH_HEIGHT}
            ref={canvasRef}
            width={GRAPH_WIDTH}
          />
          <div
            style={{
              display: 'grid',
              gridAutoColumns: '1fr',
              gridAutoFlow: 'column',
              height: '100%',
              justifyItems: 'center',
              left: 0,
              position: 'absolute',
              top: 0,
              width: '100%'
            }}
          >
            {colors.map((color, index) => (
              <ColorRangePicker
                channel={channel}
                color={color}
                colorsLength={colors.length}
                height={canvasSize[1]}
                index={index}
                key={color.id}
                max={max}
                min={min}
                nextColor={colors[index + 1] || color}
                step={step}
                width={canvasSize[0]}
                workerGroup={workerGroup}
              />
            ))}
          </div>
        </div>
      </div>
    )
  })

export default ColorGraph
