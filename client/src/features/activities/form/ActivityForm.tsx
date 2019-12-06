import React, { useState, useEffect, useContext } from 'react'
import { v4 as uuid } from 'uuid'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../app/models/activity'
import ActivityStore from '../../../app/stores/activityStore'
import { observer } from 'mobx-react-lite'
import { RouteComponentProps } from 'react-router'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput'
import TextAreaInput from '../../../app/common/form/TextAreaInput'
import SelectInput from '../../../app/common/form/SelectInput'
import DateInput from '../../../app/common/form/DateInput'
import { combineDateAndTime } from '../../../app/common/util/util'
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan
} from 'revalidate'
import { RootStoreContext } from '../../../app/stores/rootStore'

const validate = combineValidators({
  title: isRequired({ message: 'Event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(5)({
      message: 'Event description must be greater than 5 characters'
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time')
})

interface DetailParams {
  id: string
}

const categoryOptions = [
  { key: 'drinks', text: 'Drinks', value: 'drinks' },
  { key: 'culture', text: 'Culture', value: 'culture' },
  { key: 'film', text: 'Film', value: 'film' },
  { key: 'food', text: 'Food', value: 'food' },
  { key: 'music', text: 'Music', value: 'music' },
  { key: 'travel', text: 'Travel', value: 'travel' }
]

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history
}) => {
  const activityStore = useContext(RootStoreContext).activityStore
  const {
    createActivity,
    editActivity,
    submitting,
    loadActivity
  } = activityStore

  const [activity, setActivity] = useState(new ActivityFormValues())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (match.params.id) {
      setLoading(true)
      loadActivity(match.params.id)
        .then(activity => {
          setActivity(new ActivityFormValues(activity))
        })
        .finally(() => setLoading(false))
    }
  }, [match.params.id, loadActivity])

  const handleFinalFormSubmit = (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time)
    const { date, time, ...activity } = values
    activity.date = dateAndTime
    if (!activity.id) {
      const newActivity = {
        ...activity,
        id: uuid()
      }

      createActivity(newActivity)
    } else {
      editActivity(activity)
    }
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            validate={validate}
            onSubmit={handleFinalFormSubmit}
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  name='title'
                  placeholder='Title'
                  value={activity.title}
                  component={TextInput}
                />
                <Field
                  rows={3}
                  name='description'
                  placeholder='Description'
                  value={activity.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder='Category'
                  name='category'
                  value={activity.category}
                  options={categoryOptions}
                  component={SelectInput}
                />
                <Form.Group widths='equal'>
                  <Field
                    name='date'
                    placeholder='Date'
                    date={true}
                    value={activity.date}
                    component={DateInput}
                  />
                  <Field
                    name='time'
                    placeholder='Time'
                    time={true}
                    value={activity.time}
                    component={DateInput}
                  />
                </Form.Group>

                <Field
                  placeholder='City'
                  name='city'
                  value={activity.city}
                  component={TextInput}
                />
                <Field
                  placeholder='Venue'
                  name='venue'
                  value={activity.venue}
                  component={TextInput}
                />
                <Button
                  loading={submitting}
                  floated='right'
                  positive
                  type='submit'
                  content='Submit'
                  disabled={loading || invalid || pristine}
                />
                <Button
                  onClick={
                    activity.id
                      ? () => history.push(`/activities/${activity.id}`)
                      : () => history.push('/activities')
                  }
                  floated='right'
                  type='button'
                  content='Cancel'
                  disabled={loading}
                />
              </Form>
            )}
          />
          >
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityForm)
