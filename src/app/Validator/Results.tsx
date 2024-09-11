import {Flex} from 'antd'
import React, {FC} from 'react'

import {validateContrast, validatorsNames} from '../../lib/ContrastValidators'
import {SchemaColor} from '../../state'
import {rgbToHex} from '../../utils/colors.ts'

const ValidatorResults: FC<{colorA: SchemaColor; colorB: SchemaColor}> = ({
  colorA,
  colorB
}) => {
  return (
    <Flex gap={8} vertical>
      {validatorsNames.map((validatorName) => (
        <React.Fragment key={validatorName}>
          <div>{validatorName}</div>
          {validateContrast(validatorName as never, colorA.rgb, colorB.rgb).map(
            (result, resultIndex) => (
              <div
                style={{
                  background: rgbToHex(result.backgroundColor as never),
                  borderRadius: 4,
                  color: rgbToHex(result.foregroundColor as never),
                  fontSize: 24,
                  padding: '4px 8px',
                  textAlign: 'center'
                }}
                key={resultIndex}
              >
                {result.label}
              </div>
            )
          )}
        </React.Fragment>
      ))}
    </Flex>
  )
}

export default ValidatorResults
