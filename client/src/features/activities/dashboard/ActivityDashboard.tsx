import React, { useContext, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../../app/stores/rootStore'

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(RootStoreContext).activityStore
  const { loadActivities } = activityStore

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  return activityStore.loadingInitial ? (
    <LoadingComponent content='Loading Activities...' />
  ) : (
    <>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activity Filters</h2>
        </Grid.Column>
      </Grid>
    </>
  )
}

export default observer(ActivityDashboard)
