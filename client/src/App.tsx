import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import AssetsList from './features/assets/AssetsList';
import SignIn from './features/auth/SignIn';
import ProtectedRoute from './features/auth/ProtectedRoute';
import LayoutWithHeader from './layouts/LayoutWithHeader';
import Dashboard from './views/Dashboard';
import AssetDetail from './features/assets/AssetDetail';
import EditAsset from './features/assets/EditAsset';

function App() {

  return (
    <>
      <div className="app">
        <Routes>
          {/* Rutas Públicas */}
          <Route path='/' element={<><h1>Assets System Manager</h1></>}></Route>
          <Route path='/signin' element={<SignIn />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route element={<LayoutWithHeader />} >
              <Route path='/assets' element={<AssetsList />} />
              <Route path='/assets/:assetId' element={<AssetDetail />} />
              <Route path='/assets/edit/:assetId' element={<EditAsset />} />
              <Route path='/' element={<h1>Dashboard Principal</h1>} />
              <Route path='/dashboard' element={<Dashboard />} ></Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/assets" />} />
        </Routes>
      </div>
    </>
  )
}

export default App
