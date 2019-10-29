import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Menu, Container, Button } from 'semantic-ui-react'
import ActivityStore from '../../app/stores/activityStore'

const Navbar: React.FC = () => {
  const activityStore = useContext(ActivityStore)
  const { openCreateForm } = activityStore
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header>
          <img src='/assets/logo.png' alt='logo' />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' />
        <Menu.Item>
          <Button onClick={openCreateForm} positive content='Create Activity' />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default observer(Navbar)
