import {Flex} from 'antd'
import {createStyles} from 'antd-style'
import {FC} from 'react'

import {Navbar} from './Navbar'
import {Palette} from './Palette'
import {Sidebar} from './Sidebar'
import {Validator} from './Validator'

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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Navbar />
      </div>
      <Flex className={styles.body} wrap={'nowrap'}>
        <Flex style={{overflow: 'hidden'}} vertical>
          <Palette />
          <Validator />
        </Flex>
        <Sidebar />
      </Flex>
    </div>
  )
}

export default App
