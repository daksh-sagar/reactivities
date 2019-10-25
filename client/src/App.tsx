import React, { useEffect, useState } from 'react'
import { List } from 'semantic-ui-react'
import axios from 'axios'
import './App.css'

const App: React.FC = () => {
  const [values, setValues] = useState<any>([])
  useEffect(() => {
    async function fetchValues() {
      const response = await axios.get('http://localhost:5000/api/values')
      const values = response.data
      setValues(values)
    }
    fetchValues()
  }, [])
  return (
    <List>
      {values.map((value: any): any => (
        <List.Item key={value.id}>{value.name}</List.Item>
      ))}
    </List>
  )
}

export default App
