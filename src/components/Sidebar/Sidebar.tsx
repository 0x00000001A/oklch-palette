import {Flex} from 'antd'
import {createStyles} from 'antd-style'
import {FC} from 'react'

import {palette} from '../../main.tsx'

import SidebarBody from './Body.tsx'
import SidebarHeader from './Header.tsx'

const useStyle = createStyles(({css, token}) => ({
  root: css`
    background: ${token.colorBgContainer};
    border-left: 1px solid ${token.colorBorder};
    flex-shrink: 0;
    overflow: auto;
  `
}))

const Sidebar: FC = () => {
  const {styles} = useStyle()

  return (
    <Flex className={styles.root} vertical>
      <SidebarHeader />
      <SidebarBody palette={palette} />
    </Flex>
  )
}

export default Sidebar
