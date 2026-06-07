import { Navigate, Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

function AdminLayout() {
  const isLoggedIn = !!localStorage.getItem('adminToken')

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />
  }


  return (
    <div className="flex min-h-screen bg-surface-low">
      <Sidebar />
      <div className="flex-grow flex flex-col ml-[280px] min-h-screen">
        <Header />
        <main className="flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
