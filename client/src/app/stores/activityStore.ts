import { observable, action, computed, configure, runInAction } from 'mobx'
import { SyntheticEvent } from 'react'
import { createContext } from 'react'
import { IActivity } from '../models/activity'
import agent from '../api/agent'

configure({ enforceActions: 'always' })

class ActivityStore {
  @observable activityRegistry = new Map()
  @observable activities: IActivity[] = []
  @observable loadingInitial = false
  @observable selectedActivity: IActivity | undefined = undefined
  @observable editMode = false
  @observable target = ''
  @observable submitting = false

  @computed get activitiesByDate(): IActivity[] {
    return Array.from(this.activityRegistry.values()).sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    )
  }

  @action loadActivities = async () => {
    this.loadingInitial = true
    try {
      const activities = await agent.Activities.list()
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0]
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

  @action selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
    this.editMode = false
  }

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true
    try {
      await agent.Activities.create(activity)
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.editMode = false
        this.submitting = false
      })
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
      console.error(error)
    }
  }

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true
    try {
      await agent.Activities.update(activity)
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.selectedActivity = activity
        this.editMode = false
        this.submitting = false
      })
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false
      })
      console.error(error)
    }
  }

  @action openCreateForm = () => {
    this.editMode = true
    this.selectedActivity = undefined
  }

  @action openEditForm = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id)
    this.editMode = true
  }

  @action cancelSelectedActivity = () => {
    this.selectedActivity = undefined
  }

  @action cancelFormOpen = () => {
    this.editMode = false
  }
}

export default createContext(new ActivityStore())
