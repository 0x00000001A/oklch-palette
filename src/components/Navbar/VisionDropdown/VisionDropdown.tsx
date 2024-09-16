import {EyeOutlined} from '@ant-design/icons'
import {Flex, Select} from 'antd'
import {createStyles, css} from 'antd-style'
import {DefaultOptionType} from 'antd/es/select'
import {FC, useCallback, useState} from 'react'

import {visionOptions} from './data.tsx'
import VisionFilters from './filters.svg?react'
import {VisionDropdownLabelProps} from './types.ts'

const useStyles = createStyles(() => ({
  icon: css`
    position: absolute;
    z-index: 1;
    width: 3rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
  root: css`
    position: relative;

    /*noinspection CssUnusedSymbol*/
    && .ant-select .ant-select-selector {
      padding-left: calc(3rem - 8px);
    }
  `
}))

const VisionDropdownLabel: FC<VisionDropdownLabelProps> = ({description, label}) => (
  <Flex align={'center'} gap={'small'} justify={'space-between'}>
    {label} {description && <small>≈{description}% of users</small>}
  </Flex>
)

const options = visionOptions.map((option, index) => ({
  ...option,
  label: (
    <VisionDropdownLabel
      description={option.statistic}
      key={index}
      label={option.label}
    />
  ),
  name: option.label
}))

const VisionDropdown: FC = () => {
  const {styles} = useStyles()
  const [value, setValue] = useState(options[0].value)

  const handleChange = useCallback(
    (newValue: string, {raw}: DefaultOptionType & {raw?: string}) => {
      document.body.style.filter = raw || `url(#${newValue})`
      setValue(newValue)
    },
    []
  )

  return (
    <>
      <VisionFilters />
      <div className={styles.root}>
        <div className={styles.icon}>
          <EyeOutlined />
        </div>
        <Select
          options={options}
          popupMatchSelectWidth={false}
          size={'small'}
          value={value}
          variant={'borderless'}
          onChange={handleChange}
        />
      </div>
    </>
  )
}

export default VisionDropdown
