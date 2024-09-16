import {Badge, Tooltip} from 'antd'
import {createStyles, css} from 'antd-style'
import {useMemo} from 'react'

import {AnalyzerResult} from '../../lib/ContrastValidators/types.ts'
import {rgbToHex} from '../../utils/colors.ts'

const useStyles = createStyles(({token}, {result}: {result: AnalyzerResult}) => ({
  icon: css`
    color: ${result.success ? result.foregroundColor : token.colorError};
  `,
  label: css`
    color: ${rgbToHex(result.foregroundColor as never)};
    font-size: clamp(1rem, 4cqi, 3rem);
  `,
  root: css`
    container-type: inline-size;
    padding: ${token.sizeXXS}px ${token.sizeXS}px;
    font-size: 18px;
    text-align: center;
    border-radius: ${token.borderRadiusXS}px;
    background: ${rgbToHex(result.backgroundColor as never)};
  `
}))

const ValidatorResultsLabel = ({result}: {result: AnalyzerResult}) => {
  const {styles} = useStyles({result})

  const label = useMemo(() => {
    return (
      <div className={styles.root}>
        <div className={styles.label}>{result.label}</div>
      </div>
    )
  }, [result.label, styles.label, styles.root])

  if (result.success) {
    return (
      <Tooltip mouseEnterDelay={0.75} title={result.note}>
        {label}
      </Tooltip>
    )
  }

  return (
    <Badge.Ribbon
      className={styles.icon}
      color={'red'}
      text={!result.success && result.label}
    >
      {label}
    </Badge.Ribbon>
  )
}

export default ValidatorResultsLabel
