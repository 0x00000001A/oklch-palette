import {Flex, Result} from 'antd'
import {createStyles, useResponsive} from 'antd-style'
import {FC} from 'react'

import {Navbar} from './components/Navbar'
import {Palette} from './components/Palette'
import {Sidebar} from './components/Sidebar'
import {Validator} from './components/Validator'

const useStyle = createStyles(({css, token}) => ({
  body: css`
    flex-basis: min-content;
    overflow: auto;
    min-height: 0;
    flex-grow: 1;
  `,
  header: css`
    background: ${token.colorBgLayout};
    border-bottom: 1px solid ${token.colorBorder};
  `,
  root: css`
    background: ${token.colorBgElevated};
    height: 100vh;
    display: flex;
    flex-direction: column;
  `
}))

const App: FC = () => {
  const {styles} = useStyle()
  const {xxl} = useResponsive()

  if (!xxl) {
    return (
      <div className={styles.root}>
        <Result
          status={'warning'}
          subTitle={'This app is not adapted for using on the small size screens.'}
          title={'There are some problems with your operation.'}
        />
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Navbar />
      </div>
      <Flex className={styles.body} wrap={'nowrap'}>
        <Flex style={{flexGrow: 1, overflow: 'hidden'}} vertical>
          <Palette />
          <Validator />
        </Flex>
        <Sidebar />
      </Flex>
    </div>
  )
}

export default App
