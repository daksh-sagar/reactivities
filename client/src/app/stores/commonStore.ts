import { RootStore } from './rootStore'
import { observable, action } from 'mobx'

export default class CommonStore {
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @observable token: string | null = null
  @observable appLoaded = false

  @action setToken = (token: string) => {
    window.localStorage.setItem('jwt', token)
    this.token = token
  }

  @action deleteToken = () => {
    window.localStorage.removeItem('jwt')
  }

  @action setAppLoaded = () => {
    this.appLoaded = true
  }
}
