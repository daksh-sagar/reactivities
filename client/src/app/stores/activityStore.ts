import { observable, action, computed, runInAction } from 'mobx'
import { SyntheticEvent } from 'react'
import { IActivity } from '../models/activity'
import agent from '../api/agent'
import { history } from '../..'
import { toast } from 'react-toastify'
import { RootStore } from './rootStore'
import { setActivityProps, createAttendee } from '../common/util/util'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@aspnet/signalr'

const LIMIT = 2

export default class ActivityStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @observable activityRegistry = new Map()
  @observable loadingInitial = false
  @observable activity: IActivity | null = null
  @observable target = ''
  @observable submitting = false
  @observable loading = false
  @observable.ref hubConnection: HubConnection | null = null
  @observable activityCount = 0
  @observable page = 0

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT)
  }

  @action setPage = (page: number) => {
    this.page = page
  }

  @action createHubConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/chat', {
        accessTokenFactory: () => this.rootStore.commonStore.token!
      })
      .configureLogging(LogLevel.Information)
      .build()

    this.hubConnection
      .start()
      .then(() => console.log(this.hubConnection!.state))
      .catch(error => console.log('Error establishing connection: ', error))

    this.hubConnection.on('ReceiveComment', comment => {
      runInAction(() => {
        this.activity!.comments.push(comment)
      })
    })
  }

  @action stopHubConnection = () => {
    this.hubConnection!.stop()
  }

  @action addComment = async (values: any) => {
    values.activityId = this.activity!.id
    try {
      await this.hubConnection!.invoke('SendComment', values)
    } catch (error) {}
  }

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
    const loggedInUser = this.rootStore.userStore.user!
    try {
      const activitiesEnvelope = await agent.Activities.list(LIMIT, this.page)
      const { activities, activityCount } = activitiesEnvelope
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          setActivityProps(activity, loggedInUser)
          this.activityRegistry.set(activity.id, activity)
          this.activityCount = activityCount
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
      const attendee = createAttendee(this.rootStore.userStore.user!)
      attendee.isHost = true
      let attendees = []
      attendees.push(attendee)
      activity.attendees = attendees
      activity.comments = []
      activity.isHost = true
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
          this.activity = setActivityProps(
            activity,
            this.rootStore.userStore.user!
          )
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

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!)
    this.loading = true
    try {
      await agent.Activities.attend(this.activity!.id)
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees.push(attendee)
          this.activity.isGoing = true
          this.activityRegistry.set(this.activity.id, this.activity)
        }
      })
    } catch (error) {
      toast.error('Problem signing up to Activity')
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  @action cancelAttendance = async () => {
    this.loading = true
    try {
      await agent.Activities.unattend(this.activity!.id)
      runInAction(() => {
        if (this.activity) {
          this.activity.attendees = this.activity.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          )

          this.activity.isGoing = false
          this.activityRegistry.set(this.activity.id, this.activity)
        }
      })
    } catch (error) {
      toast.error('Problem cancelling attendance for the Activity')
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }
}
