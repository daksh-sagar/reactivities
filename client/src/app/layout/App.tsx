import React, { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import { IActivity } from '../models/activity'
import Navbar from '../../features/navbar/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import agent from '../api/agent'
import LoadingComponent from './LoadingComponent'

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  )
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(activity => activity.id === id)[0])
    setEditMode(false)
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const fetchActivities = () => {
    agent.Activities.list().then(response => {
      const activities: IActivity[] = []
      response.forEach(activity => {
        activity.date = activity.date.split('.')[0]
        activities.push(activity)
      })
      setActivities(activities)
      setLoading(false)
    })
  }

  const handleCreateActivity = (activity: IActivity) => {
    agent.Activities.create(activity).then(() => {
      setActivities([...activities, activity])
      setEditMode(false)
      setSelectedActivity(activity)
    })
  }

  const handleEditActivity = (activity: IActivity) => {
    agent.Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity])
      setEditMode(false)
      setSelectedActivity(activity)
    })
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  return loading ? (
    <LoadingComponent content='Loading Activities...' />
  ) : (
    <>
      <Navbar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
        />
      </Container>
    </>
  )
}

export default App
