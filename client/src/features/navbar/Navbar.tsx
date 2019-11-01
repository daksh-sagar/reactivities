import React from 'react'
import { observer } from 'mobx-react-lite'
import { Menu, Container, Button } from 'semantic-ui-react'
// import ActivityStore from '../../app/stores/activityStore'
import { Link, NavLink } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} exact to='/' header>
          <img src='/assets/logo.png' alt='logo' />
          Reactivities
        </Menu.Item>
        <Menu.Item name='Activities' exact as={NavLink} to='/activities' />
        <Menu.Item as={Link} to='/createActivity'>
          <Button positive content='Create Activity' />
        </Menu.Item>
      </Container>
    </Menu>
  )
}

export default observer(Navbar)
