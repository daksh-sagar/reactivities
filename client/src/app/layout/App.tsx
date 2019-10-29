import React, { useEffect, useContext } from 'react'
import { Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import Navbar from '../../features/navbar/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import LoadingComponent from './LoadingComponent'
import ActivityStore from '../stores/activityStore'

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore)

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore])

  return activityStore.loadingInitial ? (
    <LoadingComponent content='Loading Activities...' />
  ) : (
    <>
      <Navbar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </>
  )
}

export default observer(App)
