import {Flex} from 'antd'
import {FC, useMemo} from 'react'

import {validatorsNames} from '../../lib/ContrastValidators'
import {SchemaColor} from '../../state'

import ValidatorResultsItem from './ResultsItem.tsx'

const ValidatorResults: FC<{colorA: SchemaColor; colorB: SchemaColor}> = ({
  colorA,
  colorB
}) => {
  const results = useMemo(() => {
    return validatorsNames.map((validatorName) => (
      <ValidatorResultsItem
        colorA={colorA}
        colorB={colorB}
        key={validatorName}
        name={validatorName}
      />
    ))
  }, [colorA, colorB])

  return (
    <Flex gap={8} vertical>
      {results}
    </Flex>
  )
}

export default ValidatorResults
