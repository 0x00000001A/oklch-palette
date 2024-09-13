import React, {useMemo} from 'react'

import {validateContrast} from '../../lib/ContrastValidators'
import {SchemaColor} from '../../state'

import ValidatorResultsLabel from './ResultsLabel.tsx'

const ValidatorResultsItem = ({
  colorA,
  colorB,
  name
}: {
  colorA: SchemaColor
  colorB: SchemaColor
  name: string
}) => {
  const data = useMemo(() => {
    return validateContrast(name as never, colorA.rgb, colorB.rgb)
  }, [colorA, colorB, name])

  return (
    <React.Fragment>
      {data.label}
      <ValidatorResultsLabel result={data.results.backward} />
      <ValidatorResultsLabel result={data.results.forward} />
    </React.Fragment>
  )
}

export default ValidatorResultsItem
