import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './Navbar'
import NotionTable from './components/NotionTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar/>
     <NotionTable/>
    </>
  )
}

export default App
