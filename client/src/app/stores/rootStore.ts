import { configure } from 'mobx'
import { createContext } from 'react'
import ActivityStore from './activityStore'
import UserStore from './userStore'
import CommonStore from './commonStore'
import ProfileStore from './profileStore'

configure({ enforceActions: 'always' })

export class RootStore {
  activityStore: ActivityStore
  userStore: UserStore
  commonStore: CommonStore
  profileStore: ProfileStore

  constructor() {
    this.activityStore = new ActivityStore(this)
    this.userStore = new UserStore(this)
    this.commonStore = new CommonStore(this)
    this.profileStore = new ProfileStore(this)
  }
}

export const RootStoreContext = createContext(new RootStore())
