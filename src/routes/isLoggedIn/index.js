import { Navigate, Outlet } from "react-router-dom"

const IsLoggedIn = () => {

    const token = localStorage.getItem("token")

    return token ? <Navigate to={"/home"} /> : <Outlet />
}

export default IsLoggedIn