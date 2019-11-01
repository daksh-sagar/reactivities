import React from 'react'
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

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
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
                <Route
                  key={location.key}
                  path='/editActivity/:id'
                  component={ActivityForm}
                />
                <Route
                  key={location.key}
                  path='/createActivity'
                  component={ActivityForm}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  )
}

export default withRouter(observer(App))
