import React, { useContext, Fragment } from 'react'
import { observer } from 'mobx-react-lite'
import { Item, Label } from 'semantic-ui-react'
import ActivityListItem from './ActivityListItem'
import { RootStoreContext } from '../../../app/stores/rootStore'

const ActivityList: React.FC = () => {
  const activityStore = useContext(RootStoreContext).activityStore
  const { activitiesByDate } = activityStore
  return (
    <>
      {activitiesByDate.map(([group, activities]) => (
        <Fragment key={group}>
          <Label size='large' color='blue'>
            {group}
          </Label>
          <Item.Group divided>
            {activities.map(activity => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </Item.Group>
        </Fragment>
      ))}
    </>
  )
}

export default observer(ActivityList)
