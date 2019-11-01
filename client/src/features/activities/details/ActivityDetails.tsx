import React, { useContext, useEffect } from 'react'
import { Card, Button, Image } from 'semantic-ui-react'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { Link } from 'react-router-dom'

interface DetailsParams {
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailsParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore)
  const {
    activity,
    loadActivity,
    loadingInitial,
    clearActivity
  } = activityStore

  useEffect(() => {
    clearActivity()
    loadActivity(match.params.id)
  }, [match.params.id, loadActivity, clearActivity])

  // TODO: What to display when there is an error fetching the activity ?
  return loadingInitial || !activity ? (
    <LoadingComponent content='Loading Activity...' />
  ) : (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity!.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity!.title}</Card.Header>
        <Card.Meta>
          <span>{activity!.date}</span>
        </Card.Meta>
        <Card.Description>{activity!.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/editActivity/${activity.id}`}
            basic
            color='blue'
            content='Edit'
          />
          <Button
            onClick={() => history.push('/activities')}
            basic
            color='grey'
            content='Cancel'
          />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default observer(ActivityDetails)
