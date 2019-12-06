import { observable, action, computed, configure, runInAction } from 'mobx'
import { SyntheticEvent } from 'react'
import { createContext } from 'react'
import { IActivity } from '../models/activity'
import agent from '../api/agent'
import { history } from '../..'
import { toast } from 'react-toastify'

configure({ enforceActions: 'always' })

class ActivityStore {
  @observable activityRegistry = new Map()
  @observable loadingInitial = false
  @observable activity: IActivity | null = null
  @observable target = ''
  @observable submitting = false

  @computed get activitiesByDate() {
    return this.groupActivtiesByDate(Array.from(this.activityRegistry.values()))
  }

  groupActivtiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date!.getTime() - b.date!.getTime()
    )

    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0]
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity]
        return activities
      }, {} as { [key: string]: IActivity[] })
    )
  }

  @action loadActivities = async () => {
    this.loadingInitial = true
    try {
      const activities = await agent.Activities.list()
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity.date = new Date(activity.date)
          this.activityRegistry.set(activity.id, activity)
          this.loadingInitial = false
        })
      })
    } catch (error) {
      console.error(error)
      runInAction('load activities error', () => {
        this.loadingInitial = false
      })
    }
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true
    try {
      await agent.Activities.create(activity)
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.submitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('create activity error', () => {
        this.submitting = false
      })
      console.error(error)
    }
  }

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true
    this.target = event.currentTarget.name
    try {
      await agent.Activities.delete(id)
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id)
        this.submitting = false
        this.target = ''
      })
    } catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false
        this.target = ''
      })
      toast.error('Problem submitting data to the server')
      console.error(error.response)
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true
    try {
      await agent.Activities.update(activity)
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.activity = activity
        this.submitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false
      })
      toast.error('Problem submitting data to the server')
      console.error(error.response)
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.activityRegistry.get(id)
    if (activity) {
      this.activity = activity
      return activity
    } else {
      this.loadingInitial = true
      try {
        activity = await agent.Activities.details(id)
        runInAction('fetching activity', () => {
          activity.date = new Date(activity.date)
          this.activity = activity
          this.activityRegistry.set(activity.id, activity)
          this.loadingInitial = false
        })
        return activity
      } catch (error) {
        console.error(error)
        runInAction('fetch activity error', () => {
          this.loadingInitial = false
        })
      }
    }
  }

  @action clearActivity = () => {
    this.activity = null
  }
}

export default createContext(new ActivityStore())
