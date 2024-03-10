import {FC} from 'react'

import IconGithub from '../icons/IconGithub.tsx'

export type PlaygroundProps = {
  // props
}

const Playground: FC<PlaygroundProps> = () => {
  return (
    <div>
      <div>
        <button className={'pg-button'}>
          <IconGithub />
          Button text
        </button>
      </div>
      <button className={'pg-button'}>Text only</button>
      <div>
        <button className={'pg-button'}>
          <IconGithub />
        </button>
      </div>
    </div>
  )
}

export default Playground
