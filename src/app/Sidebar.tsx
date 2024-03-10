import {FC} from 'react'

import SidebarBody from './SidebarBody.tsx'
import SidebarHeader from './SidebarHeader.tsx'

export type SidebarProps = {
  // props
}

const Sidebar: FC<SidebarProps> = () => {
  return (
    <div className={'sidebar'}>
      <SidebarHeader />
      <SidebarBody />
    </div>
  )
}

export default Sidebar
