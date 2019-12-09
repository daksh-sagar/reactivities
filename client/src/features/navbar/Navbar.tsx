import React, { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Menu, Container, Button, Dropdown, Image } from 'semantic-ui-react'
import { Link, NavLink } from 'react-router-dom'
import { RootStoreContext } from '../../app/stores/rootStore'

const Navbar: React.FC = () => {
  const userStore = useContext(RootStoreContext).userStore
  const { user, logout } = userStore

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
        {user && (
          <Menu.Item position='right'>
            <Image
              avatar
              spaced='right'
              src={user.image || '/assets/user.png'}
            />
            <Dropdown pointing='top left' text={`${user.displayName}`}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profile/${user.username}`}
                  text='My profile'
                  icon='user'
                />
                <Dropdown.Item onClick={logout} text='Logout' icon='power' />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  )
}

export default observer(Navbar)
