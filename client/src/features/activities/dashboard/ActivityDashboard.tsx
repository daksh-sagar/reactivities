import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { Grid, Loader } from 'semantic-ui-react'
import InfiniteScroller from 'react-infinite-scroller'
import ActivityList from './ActivityList'
import { RootStoreContext } from '../../../app/stores/rootStore'
import ActivityFilters from './ActivityFilters'
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder'

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

  return (
    <>
      <Grid>
        <Grid.Column width={10}>
          {loadingInitial && page === 0 ? (
            <ActivityListItemPlaceholder />
          ) : (
            <InfiniteScroller
              pageStart={0}
              loadMore={handleGetNext}
              initialLoad={false}
              hasMore={!loadingNext && page + 1 < totalPages}
            >
              <ActivityList />
            </InfiniteScroller>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <ActivityFilters />
        </Grid.Column>
        <Grid.Column width={10}>
          <Loader active={loadingNext} />
        </Grid.Column>
      </Grid>
    </>
  )
}

export default observer(ActivityDashboard)
