import {useSortable} from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import {CSSProperties, FC, createContext, useMemo} from 'react'

import {PaletteRowContextProps, PaletteRowProps} from './types.ts'

export const PaletteRowContext = createContext<PaletteRowContextProps>({})

const PaletteRow: FC<PaletteRowProps> = (props) => {
  const {attributes, isDragging, listeners, setActivatorNodeRef, setNodeRef, transform} =
    useSortable({id: props['data-row-key']})

  const style: CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    ...(isDragging ? {position: 'relative', zIndex: 9999} : {})
  }

  const contextValue = useMemo<PaletteRowContextProps>(
    () => ({listeners, setActivatorNodeRef}),
    [setActivatorNodeRef, listeners]
  )

  return (
    <PaletteRowContext.Provider value={contextValue}>
      <tr
        {...props}
        ref={setNodeRef}
        style={style}
        {...attributes}
        tabIndex={undefined}
      />
    </PaletteRowContext.Provider>
  )
}

export default PaletteRow
