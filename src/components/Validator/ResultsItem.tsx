import {observer} from 'mobx-react-lite'
import React from 'react'

import {validateContrast} from '../../lib/ContrastValidators'
import {PaletteColor} from '../../store/PaletteStore.ts'

import ValidatorResultsLabel from './ResultsLabel.tsx'

const ValidatorResultsItem = observer(
  ({
    colorA,
    colorB,
    name
  }: {
    colorA: PaletteColor
    colorB: PaletteColor
    name: string
  }) => {
    const data = validateContrast(name as never, colorA.rgb, colorB.rgb)

    return (
      <React.Fragment>
        {data.label}
        <ValidatorResultsLabel result={data.results.backward} />
        <ValidatorResultsLabel result={data.results.forward} />
      </React.Fragment>
    )
  }
)

export default ValidatorResultsItem
