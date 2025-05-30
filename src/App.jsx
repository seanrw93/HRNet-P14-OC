import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AddEmployeesPage from './pages/AddEmployeesPage'
import EmployeesListPage from './pages/EmployeesListPage'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route index element={<AddEmployeesPage />} />
            <Route path="/employees-list" element={<EmployeesListPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App
