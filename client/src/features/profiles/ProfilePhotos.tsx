import React, { useContext, useState } from 'react'
import { Tab, Header, Card, Image, Button, Grid } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import PhotoUploadWidget from '../../app/common/photoUpload/PhotoUploadWidget'
import { observer } from 'mobx-react-lite'

const ProfilePhotos = () => {
  const { profileStore } = useContext(RootStoreContext)
  const {
    profile,
    isCurrentUser,
    uploadPhoto,
    uploadingPhoto,
    setMainPhoto,
    loading
  } = profileStore

  const [addPhotoMode, setAddPhotoMode] = useState(false)
  const [target, setTarget] = useState<string | undefined>(undefined)

  const handleUploadImage = (photo: Blob) => {
    uploadPhoto(photo).then(() => setAddPhotoMode(false))
  }

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header floated='left' icon='image' content='Photos' />
          {isCurrentUser && (
            <Button
              basic
              floated='right'
              onClick={() => setAddPhotoMode(!addPhotoMode)}
              content={addPhotoMode ? 'Go Back' : 'Add Photo'}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {addPhotoMode ? (
            <PhotoUploadWidget
              uploadPhoto={handleUploadImage}
              uploadingPhoto={uploadingPhoto}
            />
          ) : (
            <Card.Group itemsPerRow={5}>
              {profile &&
                profile.photos.map(photo => (
                  <Card key={photo.id}>
                    <Image src={photo.url} />
                    {isCurrentUser && (
                      <Button.Group fluid widths={2}>
                        <Button
                          name={photo.id}
                          basic
                          disabled={photo.isMain}
                          color='green'
                          onClick={e => {
                            setTarget(e.currentTarget.name)
                            setMainPhoto(photo)
                          }}
                          loading={loading && target === photo.id}
                          compact
                          content='Main'
                        />
                        <Button basic color='red' compact icon='trash' />
                      </Button.Group>
                    )}
                  </Card>
                ))}
            </Card.Group>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default observer(ProfilePhotos)
