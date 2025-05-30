import { Outlet } from 'react-router'

const Layout = () => {
  return (
    <div>
        <main>
            <Outlet />
        </main>
    </div>
  )
}

export default Layout