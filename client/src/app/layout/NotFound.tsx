import React from 'react'
import { Segment, Button, Header, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name='search' />
        The page you are looking for does not exist.
      </Header>
      <Segment.Inline>
        <Button as={Link} to='/activities' primary>
          Return to Activities page
        </Button>
      </Segment.Inline>
    </Segment>
  )
}

export default NotFound
