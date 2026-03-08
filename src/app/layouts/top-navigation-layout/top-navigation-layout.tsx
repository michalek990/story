import { Outlet } from 'react-router-dom'
import { Navbar } from './partials/navbar'

const TopNavigationLayout = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <Navbar />
    <main className="flex-1 p-6">
      <Outlet />
    </main>
  </div>
)

export { TopNavigationLayout }