import React, { useState, FormEvent, useEffect, useContext } from 'react'
import { v4 as uuid } from 'uuid'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router'

interface DetailParams {
  id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(ActivityStore)
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity
  } = activityStore

  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: ''
  })

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(() => {
        initialFormState && setActivity(initialFormState)
      })
    }

    return () => {
      clearActivity()
    }
  }, [
    initialFormState,
    match.params.id,
    activity.id.length,
    loadActivity,
    clearActivity
  ])

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid()
      }

      createActivity(newActivity).then(() => {
        history.push(`/activities/${newActivity.id}`)
      })
    } else {
      editActivity(activity).then(() => {
        history.push(`/activities/${activity.id}`)
      })
    }
  }

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setActivity({
      ...activity,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }
  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          name='title'
          placeholder='Title'
          onChange={handleInputChange}
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          name='description'
          placeholder='Description'
          value={activity.description}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='Category'
          name='category'
          value={activity.category}
          onChange={handleInputChange}
        />
        <Form.Input
          type='datetime-local'
          name='date'
          placeholder='Date'
          value={activity.date}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='City'
          name='city'
          value={activity.city}
          onChange={handleInputChange}
        />
        <Form.Input
          placeholder='Venue'
          name='venue'
          value={activity.venue}
          onChange={handleInputChange}
        />
        <Button
          loading={submitting}
          floated='right'
          positive
          type='submit'
          content='Submit'
        />
        <Button
          onClick={() => history.push('/activities')}
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
  )
}

export default observer(ActivityForm)
