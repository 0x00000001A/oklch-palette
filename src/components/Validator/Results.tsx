import {Flex} from 'antd'
import {observer} from 'mobx-react-lite'
import {FC} from 'react'

import {validatorsNames} from '../../lib/ContrastValidators'
import {PaletteColor} from '../../store/PaletteStore.ts'

import ValidatorResultsItem from './ResultsItem.tsx'

const ValidatorResults: FC<{colorA: PaletteColor; colorB: PaletteColor}> = observer(
  ({colorA, colorB}) => {
    return (
      <Flex gap={8} vertical>
        {validatorsNames.map((validatorName) => (
          <ValidatorResultsItem
            colorA={colorA}
            colorB={colorB}
            key={validatorName}
            name={validatorName}
          />
        ))}
      </Flex>
    )
  }
)

export default ValidatorResults
