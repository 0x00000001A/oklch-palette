import {FC, useCallback} from 'react'

import IconSave from '../../../icons/IconSave.tsx'
import {paletteExporters} from '../../../lib/PaletteExporters/PaletteExporter.ts'
import {useColorsStore} from '../../../state/index.ts'
import Dropdown from '../Dropdown/Dropdown.tsx'

const palettesOptions = paletteExporters.map((exporter, exporterIndex) => ({
  label: exporter.name,
  value: exporterIndex
}))

const ExportDropdown: FC = () => {
  const exportPalette = useColorsStore((state) => state.exportPalette)

  const handleChange = useCallback(
    (option: {label: string; value: number}) => {
      navigator.clipboard.writeText(exportPalette(paletteExporters[option.value].handler))
    },
    [exportPalette]
  )

  return (
    <Dropdown
      icon={<IconSave />}
      label={'Export'}
      options={palettesOptions}
      onChange={handleChange}
    />
  )
}

export default ExportDropdown
