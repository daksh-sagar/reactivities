import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Grid, Button } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../../app/stores/rootStore'

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(RootStoreContext).activityStore
  const {
    loadActivities,
    loadingInitial,
    setPage,
    page,
    totalPages
  } = activityStore

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  const handleGetNext = () => {
    setLoadingNext(true)
    setPage(page + 1)
    loadActivities().finally(() => setLoadingNext(false))
  }

  const [loadingNext, setLoadingNext] = useState(false)

  return loadingInitial && page === 0 ? (
    <LoadingComponent content='Loading Activities...' />
  ) : (
    <>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList />
          <Button
            floated='right'
            content='More...'
            positive
            onClick={handleGetNext}
            loading={loadingNext}
            disabled={totalPages === page + 1}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          <h2>Activity Filters</h2>
        </Grid.Column>
      </Grid>
    </>
  )
}

export default observer(ActivityDashboard)
