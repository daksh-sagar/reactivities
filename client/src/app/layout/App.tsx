import React, { useEffect, useState } from 'react'
import { Container } from 'semantic-ui-react'
import axios from 'axios'
import { IActivity } from '../models/activity'
import Navbar from '../../features/navbar/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  )
  const [editMode, setEditMode] = useState(false)

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(activity => activity.id === id)[0])
    setEditMode(false)
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const fetchActivities = () => {
    axios.get<IActivity[]>('/activities').then(response => {
      const activities: IActivity[] = []
      response.data.forEach(activity => {
        activity.date = activity.date.split('.')[0]
        activities.push(activity)
      })
      setActivities(activities)
    })
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  return (
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
        />
      </Container>
    </>
  )
}

export default App
