import {FC} from 'react'

import IconGithub from '../icons/IconGithub.tsx'
import {Button} from '../components/Button'

export type PlaygroundProps = {
  // props
}

const Playground: FC<PlaygroundProps> = () => {
  return (
    <div>
      <div>
        <Button>
          <IconGithub />
          Button text
        </Button>
      </div>
      <Button>Text only</Button>
      <div>
        <Button>
          <IconGithub />
        </Button>
      </div>
    </div>
  )
}

export default Playground
