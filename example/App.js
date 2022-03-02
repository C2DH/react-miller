import { Suspense } from 'react'
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom'
import Documents from './pages/Documents'
import About from './pages/About'
import Home from './pages/Home'
import Story from './pages/Story'
import Doc from './pages/Doc'

export default function App() {
  return (
    <Router>
      <div>
        <Link to='/'>Home</Link>
        {' | '}
        <Link to='/about'>About</Link>
        {' | '}
        <Link to='/docs'>Docs</Link>
      </div>
      <Suspense fallback={<div>Loadin Y Documets....</div>}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/story/:idOrSlug' element={<Story />} />
          <Route path='/docs' element={<Documents />} />
          <Route path='/docs/filter' element={<Documents />} />
          <Route path='/doc/:id' element={<Doc />} />
          <Route path='/about' element={<About />} />
        </Routes>
      </Suspense>
    </Router>
  )
}
