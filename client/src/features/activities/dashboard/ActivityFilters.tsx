import React, { useContext } from 'react'
import { Menu, Header } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import { Calendar } from 'react-widgets'
import { RootStoreContext } from '../../../app/stores/rootStore'

const ActivityFilters = () => {
  const { activityStore } = useContext(RootStoreContext)
  const { predicate, setPredicate } = activityStore

  return (
    <>
      <Menu vertical size={'large'} style={{ width: '100%', marginTop: 50 }}>
        <Header icon={'filter'} attached color={'teal'} content={'Filters'} />
        <Menu.Item
          active={predicate.size === 0}
          onClick={() => setPredicate('all', 'true')}
          color={'blue'}
          name={'all'}
          content={'All Activities'}
        />
        <Menu.Item
          color={'blue'}
          name={'username'}
          content={"I'm Going"}
          active={predicate.has('isGoing')}
          onClick={() => setPredicate('isGoing', 'true')}
        />
        <Menu.Item
          color={'blue'}
          name={'host'}
          active={predicate.has('isHost')}
          onClick={() => setPredicate('isHost', 'true')}
          content={"I'm hosting"}
        />
      </Menu>
      <Header
        icon={'calendar'}
        attached
        color={'teal'}
        content={'Select Date'}
      />
      <Calendar
        onChange={date => setPredicate('startDate', date!)}
        value={predicate.get('startDate') || new Date()}
      />
    </>
  )
}
export default observer(ActivityFilters)
