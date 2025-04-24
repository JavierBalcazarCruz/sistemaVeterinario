import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <>
    {/*Este sera el master page de el front */}
      <h1></h1>
        <Outlet/>
    </>
  )
}
export default AuthLayout;