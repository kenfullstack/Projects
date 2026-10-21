import './App.css'
import { Route, Routes, Navigate } from 'react-router'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Poultry from './pages/Poultry/Poultry.jsx'
import PoultryForm from './pages/PoultryForm/PoultryForm.jsx'
import Finance from './pages/Finance/Finance.jsx'
import FinanceForm from './pages/FinanceForm/FinanceForm.jsx'
import Production from './pages/Production/Production.jsx'
import ProductionForm from './pages/ProductionForm/ProductionForm.jsx'
import Layout from './Layout/Layout.jsx'
import Login from './pages/Login/Login.jsx'
import CreateAccount from './pages/CreateAccount/CreateAccount.jsx'
import { PoultryProvider } from './context/PoultryContext'
import { FinanceProvider } from './context/FinanceContext'
import { ProductionProvider } from './context/ProductionContext'
import ProtectedRoute from './components/Route/protectedRoute.jsx'

const App = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  return (
    <PoultryProvider>
      <FinanceProvider>
        <ProductionProvider>
          <Routes>
            <Route
              path='/'
              element={
                !localStorage.getItem('token')
                  ? <Navigate to='/login' replace />
                  : user?.role === 'Owner'
                    ? <Navigate to='/dashboard' replace />
                    : <Navigate to='/poultry' replace />
              }
            />

            <Route path='/login' element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path='/poultry' element={<Poultry />} />
                <Route path='/poultry/add' element={<PoultryForm />} />
                <Route path='/poultry/edit/:id' element={<PoultryForm />} />

                <Route path='/production' element={<Production />} />
                <Route path='/production/add' element={<ProductionForm />} />
                <Route path='/production/edit/:id' element={<ProductionForm />} />

                <Route element={<ProtectedRoute allowedRoles={['Owner']} />}>
                  <Route path='/dashboard' element={<Dashboard />} />

                  <Route path='/finance' element={<Finance />} />
                  <Route path='/finance/add' element={<FinanceForm />} />
                  <Route path='/finance/edit/:id' element={<FinanceForm />} />

                  <Route path='/create-account' element={<CreateAccount />} />
                </Route>
              </Route>
            </Route>
          </Routes>
        </ProductionProvider>
      </FinanceProvider>
    </PoultryProvider>
  )
}

export default App