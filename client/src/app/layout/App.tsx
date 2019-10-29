import React, { useEffect, useState, useContext } from 'react'
import { Container } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { IActivity } from '../models/activity'
import Navbar from '../../features/navbar/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent'
import ActivityStore from '../stores/activityStore'

const App: React.FC = () => {
  const activityStore = useContext(ActivityStore)

  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  )
  const [editMode, setEditMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(
      activityStore.activities.filter(activity => activity.id === id)[0]
    )
    setEditMode(false)
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true)
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity])
      setEditMode(false)
      setSelectedActivity(activity)
      setSubmitting(false)
    })
  }

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true)
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity])
      setEditMode(false)
      setSelectedActivity(activity)
      setSubmitting(false)
    })
  }

  useEffect(() => {
    activityStore.loadActivities()
  }, [activityStore])

  return activityStore.loadingInitial ? (
    <LoadingComponent content='Loading Activities...' />
  ) : (
    <>
      <Navbar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activityStore.activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          submitting={submitting}
        />
      </Container>
    </>
  )
}

export default observer(App)
