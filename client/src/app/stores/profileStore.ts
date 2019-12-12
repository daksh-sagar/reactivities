import { RootStore } from './rootStore'
import { observable, action, runInAction, computed } from 'mobx'
import { IProfile, IPhoto } from '../models/profile'
import agent from '../api/agent'
import { toast } from 'react-toastify'

export default class ProfileStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @observable profile: IProfile | null = null
  @observable loadingProfile = true
  @observable uploadingPhoto = false
  @observable loading = false

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username
    }

    return false
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true

    try {
      const profile = await agent.Profiles.get(username)
      runInAction(() => {
        this.profile = profile
      })
    } catch (error) {
      console.error(error)
    } finally {
      runInAction(() => {
        this.loadingProfile = false
      })
    }
  }

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true

    try {
      const photo = await agent.Profiles.uploadPhoto(file)
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo)
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url
            this.profile.image = photo.url
          }
        }
      })
    } catch (error) {
      console.error(error)
      toast.error('Problem uploading photo')
    } finally {
      runInAction(() => {
        this.uploadingPhoto = false
      })
    }
  }

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true
    try {
      await agent.Profiles.setMainPhoto(photo.id)
      runInAction(() => {
        this.rootStore.userStore.user!.image = photo.url
        this.profile!.photos.find(p => p.isMain)!.isMain = false
        this.profile!.photos.find(p => p.id === photo.id)!.isMain = true
        this.profile!.image = photo.url
      })
    } catch (error) {
      console.error(error)
      toast.error('Problem setting photo as main')
    } finally {
      runInAction(() => (this.loading = false))
    }
  }

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true
    try {
      await agent.Profiles.deletePhoto(photo.id)
      runInAction(() => {
        this.profile!.photos = this.profile!.photos.filter(
          p => p.id !== photo.id
        )
      })
    } catch (error) {
      console.error(error)
      toast.error('Problem deleting photo')
    } finally {
      runInAction(() => (this.loading = false))
    }
  }
}