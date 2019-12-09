import React, { useContext, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import {
  Route,
  Switch,
  withRouter,
  RouteComponentProps
} from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { ToastContainer } from 'react-toastify'
import Navbar from '../../features/navbar/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'
import HomePage from '../../features/home/HomePage'
import ActivityForm from '../../features/activities/form/ActivityForm'
import ActivityDetails from '../../features/activities/details/ActivityDetails'
import NotFound from './NotFound'
import LoginForm from '../../features/user/LoginForm'
import { RootStoreContext } from '../stores/rootStore'
import LoadingComponent from './LoadingComponent'
import RegisterForm from '../../features/user/RegisterForm'
import ProfilePage from '../../features/profiles/ProfilePage'

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const { commonStore, userStore } = useContext(RootStoreContext)
  const { appLoaded, setAppLoaded, token } = commonStore
  const { getLoggedInUser } = userStore

  useEffect(() => {
    if (token) {
      getLoggedInUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded()
    }
  }, [token, setAppLoaded, getLoggedInUser])

  return appLoaded ? (
    <>
      <ToastContainer position='bottom-right' pauseOnHover={false} />
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <Navbar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <Route path='/activities/:id' component={ActivityDetails} />
                <Route path='/activities' component={ActivityDashboard} />
                <Route path='/profile/:username' component={ProfilePage} />
                <Route
                  key={location.key}
                  path='/manage/:id'
                  component={ActivityForm}
                />
                <Route
                  key={location.key}
                  path='/createActivity'
                  component={ActivityForm}
                />
                <Route path='/login' component={LoginForm} />
                <Route path='/register' component={RegisterForm} />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  ) : (
    <LoadingComponent content='Loading App...' />
  )
}

export default withRouter(observer(App))
