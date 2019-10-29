import React, { useState, FormEvent, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'

interface IProps {
  setEditMode: (editMode: boolean) => void
  activity: IActivity | null
  createActivity: (activity: IActivity) => void
  editActivity: (activity: IActivity) => void
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState,
  createActivity,
  editActivity
}) => {
  const initializeForm = () => {
    if (initialFormState) return initialFormState

    return {
      id: '',
      title: '',
      category: '',
      description: '',
      date: '',
      city: '',
      venue: ''
    }
  }

  const [activity, setActivity] = useState<IActivity>(initializeForm)
  useEffect(() => {
    setActivity(initializeForm())
  }, [initialFormState])

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      const newActivity = {
        ...activity,
        id: uuid()
      }

      createActivity(newActivity)
    } else {
      editActivity(activity)
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
          floated='right'
          positive
          type='submit'
          content='Submit'
          onChange={handleInputChange}
        />
        <Button
          onClick={() => setEditMode(false)}
          floated='right'
          type='button'
          content='Cancel'
        />
      </Form>
    </Segment>
  )
}

export default ActivityForm
